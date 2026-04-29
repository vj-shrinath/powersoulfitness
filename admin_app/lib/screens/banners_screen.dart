import 'dart:io';
import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:image_picker/image_picker.dart';
import 'package:powersoul_admin/theme.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:path/path.dart' as p;

class BannersScreen extends StatefulWidget {
  const BannersScreen({super.key});

  @override
  State<BannersScreen> createState() => _BannersScreenState();
}

class _BannersScreenState extends State<BannersScreen> {
  final _supabase = Supabase.instance.client;
  List<dynamic> _banners = [];
  bool _loading = true;
  final ImagePicker _picker = ImagePicker();

  @override
  void initState() {
    super.initState();
    _fetchBanners();
  }

  Future<void> _fetchBanners() async {
    if (!mounted) return;
    setState(() => _loading = true);
    try {
      final data = await _supabase
          .from('banners')
          .select()
          .order('type', ascending: true);
      if (mounted) {
        setState(() => _banners = data);
      }
    } catch (e) {
      debugPrint('Error: $e');
    } finally {
      if (mounted) {
        setState(() => _loading = false);
      }
    }
  }

  Future<void> _toggleBanner(String id, bool currentStatus) async {
    try {
      await _supabase
          .from('banners')
          .update({'active': !currentStatus})
          .eq('id', id);
      _fetchBanners();
    } catch (e) {
      debugPrint('Error: $e');
    }
  }

  Future<void> _deleteBanner(String id) async {
    try {
      await _supabase.from('banners').delete().eq('id', id);
      _fetchBanners();
    } catch (e) {
      debugPrint('Error: $e');
    }
  }

  void _showAddBannerSheet() {
    final linkController = TextEditingController();
    String type = 'horizontal';
    XFile? selectedImage;

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: AppTheme.darkAlt,
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(25))),
      builder: (context) => StatefulBuilder(
        builder: (context, setSheetState) => Padding(
          padding: EdgeInsets.only(
            bottom: MediaQuery.of(context).viewInsets.bottom,
            left: 20,
            right: 20,
            top: 20,
          ),
          child: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                const Text('Upload New Banner', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
                const SizedBox(height: 20),
                
                // Type Selection
                Row(
                  children: [
                    Expanded(
                      child: ChoiceChip(
                        label: const Center(child: Text('DESKTOP')),
                        selected: type == 'horizontal',
                        onSelected: (val) => setSheetState(() => type = 'horizontal'),
                        selectedColor: AppTheme.primaryColor.withOpacity(0.2),
                      ),
                    ),
                    const SizedBox(width: 10),
                    Expanded(
                      child: ChoiceChip(
                        label: const Center(child: Text('MOBILE')),
                        selected: type == 'vertical',
                        onSelected: (val) => setSheetState(() => type = 'vertical'),
                        selectedColor: AppTheme.accentColor.withOpacity(0.2),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 20),
                
                // Image Picker
                InkWell(
                  onTap: () async {
                    final img = await _picker.pickImage(
                      source: ImageSource.gallery,
                      imageQuality: 70,
                      maxWidth: 1920,
                      maxHeight: 1920,
                    );
                    if (img != null) {
                      setSheetState(() => selectedImage = img);
                    }
                  },
                  child: Container(
                    height: 150,
                    decoration: BoxDecoration(
                      color: Colors.white.withOpacity(0.05),
                      borderRadius: BorderRadius.circular(15),
                      border: Border.all(color: AppTheme.glassBorder),
                    ),
                    child: selectedImage != null
                        ? ClipRRect(
                            borderRadius: BorderRadius.circular(15),
                            child: Image.file(File(selectedImage!.path), fit: BoxFit.cover),
                          )
                        : const Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Icon(LucideIcons.upload, color: AppTheme.textGrey),
                              SizedBox(height: 10),
                              Text('Tap to select banner image', style: TextStyle(color: AppTheme.textGrey)),
                            ],
                          ),
                  ),
                ),
                const SizedBox(height: 20),
                
                TextField(
                  controller: linkController,
                  decoration: const InputDecoration(
                    labelText: 'Target Link (Optional)',
                    hintText: 'https://powersoulfitness.com/join',
                  ),
                ),
                const SizedBox(height: 25),
                
                ElevatedButton(
                  onPressed: selectedImage == null ? null : () async {
                    setSheetState(() => _loading = true);
                    try {
                      final fileBytes = await selectedImage!.readAsBytes();
                      final fileName = 'banners/${DateTime.now().millisecondsSinceEpoch}${p.extension(selectedImage!.path)}';
                      
                      await _supabase.storage.from('assets').uploadBinary(
                            fileName,
                            fileBytes,
                            fileOptions: const FileOptions(upsert: true),
                          );
                      
                      final imageUrl = 'https://lbgpcwuqxtpibzorpzsh.supabase.co/storage/v1/object/public/assets/$fileName';
                      
                      await _supabase.from('banners').insert({
                        'type': type,
                        'image_url': imageUrl,
                        'link': linkController.text.trim(),
                        'active': true,
                      });
                      
                      if (context.mounted) Navigator.pop(context);
                      _fetchBanners();
                    } catch (e) {
                      debugPrint('Error uploading banner: $e');
                    }
                  },
                  child: const Text('UPLOAD BANNER'),
                ),
                const SizedBox(height: 30),
              ],
            ),
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Announcement Banners'),
        actions: [
          IconButton(
            icon: const Icon(LucideIcons.plus, color: AppTheme.primaryColor),
            onPressed: _showAddBannerSheet,
          ),
        ],
      ),
      body: _loading
          ? const Center(child: CircularProgressIndicator())
          : RefreshIndicator(
              onRefresh: _fetchBanners,
              child: _banners.isEmpty
                  ? const Center(child: Text('No banners found', style: TextStyle(color: AppTheme.textGrey)))
                  : ListView.builder(
                      padding: const EdgeInsets.all(20),
                      itemCount: _banners.length,
                      itemBuilder: (context, index) {
                        final banner = _banners[index];
                        final bool isActive = banner['active'] ?? false;
                        final bool isMobile = banner['type'] == 'vertical';
                        
                        return Container(
                          margin: const EdgeInsets.only(bottom: 20),
                          decoration: BoxDecoration(
                            color: AppTheme.darkAlt,
                            borderRadius: BorderRadius.circular(20),
                            border: Border.all(
                              color: isActive 
                                  ? (isMobile ? AppTheme.accentColor : AppTheme.primaryColor).withOpacity(0.5) 
                                  : AppTheme.glassBorder,
                            ),
                          ),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.stretch,
                            children: [
                              ClipRRect(
                                borderRadius: const BorderRadius.vertical(top: Radius.circular(20)),
                                child: AspectRatio(
                                  aspectRatio: isMobile ? 9/16 : 21/9,
                                  child: Stack(
                                    children: [
                                      Positioned.fill(
                                        child: Image.network(
                                          banner['image_url'],
                                          fit: BoxFit.cover,
                                        ),
                                      ),
                                      Positioned(
                                        top: 10,
                                        left: 10,
                                        child: Container(
                                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                                          decoration: BoxDecoration(
                                            color: Colors.black54,
                                            borderRadius: BorderRadius.circular(10),
                                          ),
                                          child: Text(
                                            isMobile ? 'MOBILE' : 'DESKTOP',
                                            style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold),
                                          ),
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                              ),
                              Padding(
                                padding: const EdgeInsets.all(15),
                                child: Row(
                                  children: [
                                    Expanded(
                                      child: Column(
                                        crossAxisAlignment: CrossAxisAlignment.start,
                                        children: [
                                          Text(
                                            banner['link']?.isNotEmpty == true ? banner['link'] : 'No link',
                                            style: const TextStyle(color: AppTheme.textGrey, fontSize: 12),
                                            maxLines: 1,
                                            overflow: TextOverflow.ellipsis,
                                          ),
                                        ],
                                      ),
                                    ),
                                    Switch(
                                      value: isActive,
                                      activeTrackColor: isMobile ? AppTheme.accentColor : AppTheme.primaryColor,
                                      onChanged: (val) => _toggleBanner(banner['id'].toString(), isActive),
                                    ),
                                    IconButton(
                                      icon: const Icon(LucideIcons.trash2, color: Colors.redAccent, size: 20),
                                      onPressed: () => _deleteBanner(banner['id'].toString()),
                                    ),
                                  ],
                                ),
                              ),
                            ],
                          ),
                        );
                      },
                    ),
            ),
    );
  }
}
