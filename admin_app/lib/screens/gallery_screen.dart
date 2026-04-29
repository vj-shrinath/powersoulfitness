
import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:image_picker/image_picker.dart';
import 'package:powersoul_admin/theme.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:path/path.dart' as p;

class GalleryScreen extends StatefulWidget {
  const GalleryScreen({super.key});

  @override
  State<GalleryScreen> createState() => _GalleryScreenState();
}

class _GalleryScreenState extends State<GalleryScreen> {
  final _supabase = Supabase.instance.client;
  List<FileObject> _files = [];
  bool _loading = true;
  final ImagePicker _picker = ImagePicker();

  @override
  void initState() {
    super.initState();
    _fetchFiles();
  }

  Future<void> _fetchFiles() async {
    if (!mounted) return;
    setState(() => _loading = true);
    try {
      final List<FileObject> objects = await _supabase.storage.from('assets').list(
        path: 'gallery',
        searchOptions: const SearchOptions(
          sortBy: SortBy(column: 'created_at', order: 'desc'),
        ),
      );
      if (mounted) {
        setState(() => _files = objects.where((f) => f.name != '.emptyFolderPlaceholder' && !f.name.startsWith('.')).toList());
      }
    } catch (e) {
      debugPrint('Error fetching storage: $e');
    } finally {
      if (mounted) {
        setState(() => _loading = false);
      }
    }
  }

  Future<void> _uploadImages() async {
    final List<XFile> images = await _picker.pickMultiImage(
      imageQuality: 70,
      maxWidth: 1920,
      maxHeight: 1920,
    );
    if (images.isEmpty) return;

    setState(() => _loading = true);
    int successCount = 0;
    
    try {
      for (final image in images) {
        final fileBytes = await image.readAsBytes();
        final fileName =
            'gallery/${DateTime.now().millisecondsSinceEpoch}_${successCount}${p.extension(image.path)}';

        await _supabase.storage.from('assets').uploadBinary(
              fileName,
              fileBytes,
              fileOptions: const FileOptions(upsert: true),
            );
        successCount++;
      }

      _fetchFiles();
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('$successCount images uploaded successfully!'),
            backgroundColor: Colors.green,
          ),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Upload failed at image $successCount: $e'),
            backgroundColor: Colors.red,
          ),
        );
      }
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  Future<void> _deleteImage(String name) async {
    try {
      await _supabase.storage.from('assets').remove(['gallery/$name']);
      _fetchFiles();
    } catch (e) {
      debugPrint('Delete error: $e');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Gym Gallery'),
        actions: [
          IconButton(
            icon: const Icon(LucideIcons.imagePlus, color: AppTheme.primaryColor),
            onPressed: _uploadImages,
          ),
        ],
      ),
      body: _loading
          ? const Center(child: CircularProgressIndicator())
          : RefreshIndicator(
              onRefresh: _fetchFiles,
              child: _files.isEmpty
                  ? const Center(child: Text('No images found', style: TextStyle(color: AppTheme.textGrey)))
                  : GridView.builder(
                      padding: const EdgeInsets.all(15),
                      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                        crossAxisCount: 2,
                        crossAxisSpacing: 15,
                        mainAxisSpacing: 15,
                        childAspectRatio: 0.8,
                      ),
                      itemCount: _files.length,
                      itemBuilder: (context, index) {
                        final file = _files[index];
                        final publicUrl = _supabase.storage.from('assets').getPublicUrl('gallery/${file.name}');
                        
                        return Container(
                          decoration: BoxDecoration(
                            color: AppTheme.darkAlt,
                            borderRadius: BorderRadius.circular(15),
                            border: Border.all(color: AppTheme.glassBorder),
                          ),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.stretch,
                            children: [
                              Expanded(
                                child: ClipRRect(
                                  borderRadius: const BorderRadius.vertical(top: Radius.circular(15)),
                                  child: Image.network(
                                    publicUrl,
                                    fit: BoxFit.cover,
                                    errorBuilder: (context, error, stackTrace) => const Icon(Icons.broken_image),
                                  ),
                                ),
                              ),
                              Padding(
                                padding: const EdgeInsets.all(8.0),
                                child: Row(
                                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                  children: [
                                    Expanded(
                                      child: Text(
                                        file.name,
                                        maxLines: 1,
                                        overflow: TextOverflow.ellipsis,
                                        style: const TextStyle(fontSize: 10, color: AppTheme.textGrey),
                                      ),
                                    ),
                                    IconButton(
                                      icon: const Icon(LucideIcons.trash2, size: 16, color: Colors.redAccent),
                                      onPressed: () => _deleteImage(file.name),
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
