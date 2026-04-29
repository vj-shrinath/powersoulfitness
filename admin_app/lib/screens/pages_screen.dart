import 'dart:io';
import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:image_picker/image_picker.dart';
import 'package:powersoul_admin/theme.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:path/path.dart' as p;

class PagesScreen extends StatefulWidget {
  const PagesScreen({super.key});

  @override
  State<PagesScreen> createState() => _PagesScreenState();
}

class _PagesScreenState extends State<PagesScreen> {
  final _supabase = Supabase.instance.client;
  final _picker = ImagePicker();
  Map<String, List<Map<String, dynamic>>> _grouped = {};
  bool _loading = true;
  String? _expandedSection;

  static const _supabaseUrl =
      'https://lbgpcwuqxtpibzorpzsh.supabase.co';

  @override
  void initState() {
    super.initState();
    _fetch();
  }

  // ── Fetch & group by section prefix ───────────────────────────────────────
  Future<void> _fetch() async {
    if (!mounted) return;
    setState(() => _loading = true);
    try {
      final data = await _supabase
          .from('content')
          .select()
          .order('key', ascending: true);

      final Map<String, List<Map<String, dynamic>>> grouped = {};
      for (final row in data as List) {
        final key = row['key'] as String? ?? '';
        String section =
            key.contains('_') ? key.split('_').first : 'general';
        
        // Better mapping for specific keys
        if (key.startsWith('home_hero_')) section = 'hero';
        if (key.startsWith('home_powers_')) section = 'powers';
        if (key.startsWith('home_about_')) section = 'about';

        grouped.putIfAbsent(section, () => []);
        grouped[section]!.add(Map<String, dynamic>.from(row));
      }
      if (mounted) {
        setState(() {
          _grouped = grouped;
          // Prioritize expanding the 'hero' section if it exists
          if (grouped.containsKey('hero')) {
            _expandedSection ??= 'hero';
          } else {
            _expandedSection ??=
                grouped.keys.isNotEmpty ? grouped.keys.first : null;
          }
        });
      }
    } catch (e) {
      debugPrint('Fetch error: $e');
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  // ── Delete ─────────────────────────────────────────────────────────────────
  Future<void> _delete(Map<String, dynamic> item) async {
    final ok = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: AppTheme.darkAlt,
        title: const Text('Delete Content'),
        content: Text('Remove "${item['key']}" permanently?'),
        actions: [
          TextButton(
              onPressed: () => Navigator.pop(ctx, false),
              child: const Text('Cancel')),
          TextButton(
              onPressed: () => Navigator.pop(ctx, true),
              child: const Text('Delete',
                  style: TextStyle(color: Colors.redAccent))),
        ],
      ),
    );
    if (ok != true) return;
    await _supabase.from('content').delete().eq('id', item['id']);
    _fetch();
  }

  // ── Upload image to Supabase storage ───────────────────────────────────────
  Future<String?> _uploadImage(XFile image) async {
    final bytes = await image.readAsBytes();
    final fileName =
        'pages/${DateTime.now().millisecondsSinceEpoch}${p.extension(image.path)}';
    await _supabase.storage.from('assets').uploadBinary(
          fileName,
          bytes,
          fileOptions: const FileOptions(upsert: true),
        );
    return '$_supabaseUrl/storage/v1/object/public/assets/$fileName';
  }

  // ── Helper: Detect if key is a slider ────────────────────────────────────
  bool _isSlider(String key) => key.contains('slider') || key.contains('images');

  // ── Add / Edit sheet ───────────────────────────────────────────────────────
  void _showEditSheet({Map<String, dynamic>? item, String? defaultSection}) {
    final keyCtrl = TextEditingController(text: item?['key'] ?? '');
    final valueCtrl = TextEditingController(
        text: item?['type'] != 'image' ? (item?['value'] ?? '') : '');
    String type = item?['type'] ?? 'text';
    XFile? pickedFile;
    bool uploading = false;

    // Multi-image slider support
    List<String> sliderImages = [];
    bool isSlider = _isSlider(keyCtrl.text);

    if (isSlider && item != null && item['value'] != null) {
      try {
        final parsed = jsonDecode(item['value']);
        if (parsed is List) {
          sliderImages = List<String>.from(parsed);
        }
      } catch (e) {
        debugPrint('JSON parse error: $e');
      }
    }

    // Pre-fill section prefix
    if (item == null && defaultSection != null && defaultSection != 'general') {
      keyCtrl.text = '${defaultSection}_';
    }

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: AppTheme.darkAlt,
      shape: const RoundedRectangleBorder(
          borderRadius: BorderRadius.vertical(top: Radius.circular(25))),
      builder: (ctx) => StatefulBuilder(
        builder: (ctx, setSheet) {
          isSlider = _isSlider(keyCtrl.text);

          return Padding(
            padding: EdgeInsets.only(
              bottom: MediaQuery.of(ctx).viewInsets.bottom,
              left: 20,
              right: 20,
              top: 20,
            ),
            child: SingleChildScrollView(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  // Header
                  Row(children: [
                    Text(
                      item == null ? 'Add Content' : 'Edit Content',
                      style: const TextStyle(
                          fontSize: 20, fontWeight: FontWeight.bold),
                    ),
                    const Spacer(),
                    Container(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 10, vertical: 4),
                      decoration: BoxDecoration(
                        color: AppTheme.primaryColor.withOpacity(0.15),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Text(
                        isSlider ? 'SLIDER' : type.toUpperCase(),
                        style: const TextStyle(
                            fontSize: 10,
                            fontWeight: FontWeight.bold,
                            color: AppTheme.primaryColor),
                      ),
                    ),
                  ]),
                  const SizedBox(height: 20),

                  // Content key
                  TextField(
                    controller: keyCtrl,
                    readOnly: item != null,
                    decoration: InputDecoration(
                      labelText: 'Content Key',
                      hintText: 'hero_title',
                      suffixIcon: item != null
                          ? const Icon(LucideIcons.lock,
                              size: 16, color: AppTheme.textGrey)
                          : null,
                    ),
                    onChanged: (v) => setSheet(() {}), // refresh isSlider
                  ),
                  const SizedBox(height: 15),

                  // Multi-Image Slider Editor
                  if (isSlider) ...[
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text('Slider Images (Drag to reorder)',
                            style: TextStyle(
                                fontSize: 14, fontWeight: FontWeight.bold)),
                        Text('${sliderImages.length} items',
                            style: const TextStyle(
                                fontSize: 12, color: AppTheme.textGrey)),
                      ],
                    ),
                    const SizedBox(height: 10),

                    if (sliderImages.isEmpty)
                      const Padding(
                        padding: EdgeInsets.symmetric(vertical: 40),
                        child: Column(
                          children: [
                            Icon(LucideIcons.image,
                                size: 40, color: Colors.white10),
                            SizedBox(height: 10),
                            Text('No images in this slider yet.',
                                textAlign: TextAlign.center,
                                style: TextStyle(color: AppTheme.textGrey)),
                          ],
                        ),
                      ),

                    // Reorderable list of existing images
                    if (sliderImages.isNotEmpty)
                      SizedBox(
                        height: 350, // Fixed height for the reorderable list
                        child: ReorderableListView.builder(
                          shrinkWrap: true,
                          itemCount: sliderImages.length,
                          onReorder: (oldIdx, newIdx) {
                            setSheet(() {
                              if (newIdx > oldIdx) newIdx -= 1;
                              final item = sliderImages.removeAt(oldIdx);
                              sliderImages.insert(newIdx, item);
                            });
                          },
                          itemBuilder: (ctx, idx) {
                            final url = sliderImages[idx];
                            return Container(
                              key: ValueKey(url + idx.toString()),
                              margin: const EdgeInsets.only(bottom: 10),
                              padding: const EdgeInsets.all(8),
                              decoration: BoxDecoration(
                                color: Colors.white.withOpacity(0.05),
                                borderRadius: BorderRadius.circular(12),
                                border: Border.all(color: AppTheme.glassBorder),
                              ),
                              child: Row(
                                children: [
                                  const Icon(LucideIcons.gripVertical,
                                      size: 18, color: AppTheme.textGrey),
                                  const SizedBox(width: 8),
                                  ClipRRect(
                                    borderRadius: BorderRadius.circular(8),
                                    child: Image.network(url,
                                        width: 50,
                                        height: 50,
                                        fit: BoxFit.cover,
                                        errorBuilder: (_, __, ___) =>
                                            const Icon(LucideIcons.image,
                                                size: 20)),
                                  ),
                                  const SizedBox(width: 12),
                                  Expanded(
                                    child: Text('Image #${idx + 1}',
                                        style: const TextStyle(
                                            fontSize: 12,
                                            fontWeight: FontWeight.bold)),
                                  ),
                                  IconButton(
                                    icon: const Icon(LucideIcons.trash2,
                                        size: 18, color: Colors.redAccent),
                                    onPressed: () => setSheet(() {
                                      sliderImages.removeAt(idx);
                                    }),
                                  ),
                                ],
                              ),
                            );
                          },
                        ),
                      ),

                    const SizedBox(height: 15),

                    // Add images button (Multi-pick)
                    if (!uploading)
                      ElevatedButton.icon(
                        onPressed: () async {
                          final List<XFile> imgs = await _picker.pickMultiImage(
                              imageQuality: 70, maxWidth: 1920, maxHeight: 1920);
                          if (imgs.isNotEmpty) {
                            setSheet(() => uploading = true);
                            try {
                              for (final img in imgs) {
                                final url = await _uploadImage(img);
                                if (url != null) {
                                  setSheet(() => sliderImages.add(url));
                                }
                              }
                            } catch (e) {
                              debugPrint('Upload error: $e');
                            } finally {
                              setSheet(() => uploading = false);
                            }
                          }
                        },
                        icon: const Icon(LucideIcons.plus, size: 18),
                        label: const Text('PICK MULTIPLE IMAGES'),
                        style: ElevatedButton.styleFrom(
                          backgroundColor:
                              AppTheme.primaryColor.withOpacity(0.2),
                          foregroundColor: AppTheme.primaryColor,
                          side: const BorderSide(color: AppTheme.primaryColor),
                          elevation: 0,
                        ),
                      ),
                  ] else ...[
                    // Standard single value editors (Text or Image)
                    if (item == null) ...[
                      Row(children: [
                        Expanded(
                          child: _typeChip(
                              'Text', LucideIcons.type, type == 'text',
                              () => setSheet(() => type = 'text')),
                        ),
                        const SizedBox(width: 10),
                        Expanded(
                          child: _typeChip(
                              'Image', LucideIcons.image, type == 'image',
                              () => setSheet(() => type = 'image')),
                        ),
                      ]),
                      const SizedBox(height: 15),
                    ],

                    if (type == 'text') ...[
                      TextField(
                        controller: valueCtrl,
                        maxLines: 4,
                        decoration: const InputDecoration(labelText: 'Value'),
                      ),
                    ] else ...[
                      if (item != null && item['value'] != null)
                        ClipRRect(
                          borderRadius: BorderRadius.circular(12),
                          child: Image.network(
                            item['value'],
                            height: 120,
                            width: double.infinity,
                            fit: BoxFit.cover,
                            errorBuilder: (_, __, ___) =>
                                const SizedBox.shrink(),
                          ),
                        ),
                      if (item != null) const SizedBox(height: 10),
                      GestureDetector(
                        onTap: () async {
                          final img = await _picker.pickImage(
                              source: ImageSource.gallery, imageQuality: 70, maxWidth: 1920, maxHeight: 1920);
                          if (img != null) setSheet(() => pickedFile = img);
                        },
                        child: Container(
                          height: 120,
                          decoration: BoxDecoration(
                            color: Colors.white.withOpacity(0.04),
                            borderRadius: BorderRadius.circular(15),
                            border: Border.all(
                              color: pickedFile != null
                                  ? AppTheme.primaryColor
                                  : AppTheme.glassBorder,
                              width: pickedFile != null ? 2 : 1,
                            ),
                          ),
                          child: pickedFile != null
                              ? ClipRRect(
                                  borderRadius: BorderRadius.circular(14),
                                  child: Image.file(
                                    File(pickedFile!.path),
                                    fit: BoxFit.cover,
                                    width: double.infinity,
                                  ),
                                )
                              : Column(
                                  mainAxisAlignment: MainAxisAlignment.center,
                                  children: [
                                    Icon(LucideIcons.uploadCloud,
                                        color: AppTheme.textGrey, size: 28),
                                    const SizedBox(height: 8),
                                    const Text('Tap to pick image',
                                        style: TextStyle(
                                            color: AppTheme.textGrey)),
                                  ],
                                ),
                        ),
                      ),
                    ],
                  ],

                  const SizedBox(height: 25),

                  // Save button
                  ElevatedButton(
                    onPressed: uploading
                        ? null
                        : () async {
                            setSheet(() => uploading = true);
                            try {
                              String finalValue = valueCtrl.text.trim();

                              if (isSlider) {
                                finalValue = jsonEncode(sliderImages);
                              } else if (type == 'image') {
                                if (pickedFile == null && item == null) return;
                                if (pickedFile != null) {
                                  final url = await _uploadImage(pickedFile!);
                                  if (url != null) finalValue = url;
                                } else {
                                  finalValue = item?['value'] ?? '';
                                }
                              }

                              final payload = {
                                'key': keyCtrl.text.trim(),
                                'value': finalValue,
                                'type': isSlider ? 'text' : type,
                                'updated_at': DateTime.now().toIso8601String(),
                              };

                              if (item == null) {
                                await _supabase.from('content').insert(payload);
                              } else {
                                await _supabase
                                    .from('content')
                                    .update({
                                      'value': finalValue,
                                      'type': isSlider ? 'text' : type,
                                      'updated_at':
                                          DateTime.now().toIso8601String()
                                    })
                                    .eq('id', item['id']);
                              }

                              if (ctx.mounted) Navigator.pop(ctx);
                              _fetch();
                            } catch (e) {
                              if (ctx.mounted) {
                                ScaffoldMessenger.of(ctx).showSnackBar(
                                  SnackBar(
                                      content: Text('Error: $e'),
                                      backgroundColor: Colors.redAccent),
                                );
                              }
                            } finally {
                              if (ctx.mounted)
                                setSheet(() => uploading = false);
                            }
                          },
                    child: uploading
                        ? const SizedBox(
                            width: 20,
                            height: 20,
                            child: CircularProgressIndicator(
                                strokeWidth: 2, color: Colors.white),
                          )
                        : Text(item == null ? 'ADD CONTENT' : 'SAVE CHANGES'),
                  ),
                  const SizedBox(height: 30),
                ],
              ),
            ),
          );
        },
      ),
    );
  }

  Widget _typeChip(
      String label, IconData icon, bool selected, VoidCallback onTap) {
    return GestureDetector(
      onTap: onTap,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 180),
        padding: const EdgeInsets.symmetric(vertical: 12),
        decoration: BoxDecoration(
          color: selected
              ? AppTheme.primaryColor.withOpacity(0.15)
              : Colors.white.withOpacity(0.04),
          borderRadius: BorderRadius.circular(12),
          border: Border.all(
            color: selected ? AppTheme.primaryColor : Colors.white12,
            width: selected ? 2 : 1,
          ),
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(icon,
                size: 16,
                color:
                    selected ? AppTheme.primaryColor : AppTheme.textGrey),
            const SizedBox(width: 6),
            Text(label,
                style: TextStyle(
                    fontWeight: FontWeight.bold,
                    color: selected
                        ? AppTheme.primaryColor
                        : AppTheme.textGrey)),
          ],
        ),
      ),
    );
  }

  // ── Build ──────────────────────────────────────────────────────────────────
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Page Content'),
        actions: [
          IconButton(
            icon: const Icon(LucideIcons.plus,
                color: AppTheme.primaryColor),
            onPressed: () => _showEditSheet(),
          ),
        ],
      ),
      body: _loading
          ? const Center(child: CircularProgressIndicator())
          : RefreshIndicator(
              onRefresh: _fetch,
              child: _grouped.isEmpty
                  ? _emptyState()
                  : ListView(
                      padding: const EdgeInsets.fromLTRB(16, 16, 16, 80),
                      children: _grouped.entries.map((entry) {
                        final section = entry.key;
                        final items = entry.value;
                        final isExpanded = _expandedSection == section;

                        return Container(
                          margin: const EdgeInsets.only(bottom: 16),
                          decoration: BoxDecoration(
                            color: AppTheme.darkAlt,
                            borderRadius: BorderRadius.circular(20),
                            border: Border.all(
                              color: isExpanded
                                  ? AppTheme.primaryColor.withOpacity(0.4)
                                  : AppTheme.glassBorder,
                            ),
                          ),
                          child: Column(
                            children: [
                              // Section header
                              InkWell(
                                borderRadius: BorderRadius.circular(20),
                                onTap: () => setState(() {
                                  _expandedSection =
                                      isExpanded ? null : section;
                                }),
                                child: Padding(
                                  padding: const EdgeInsets.symmetric(
                                      horizontal: 20, vertical: 16),
                                  child: Row(
                                    children: [
                                      Container(
                                        width: 36, height: 36,
                                        decoration: BoxDecoration(
                                          color: AppTheme.primaryColor
                                              .withOpacity(0.15),
                                          borderRadius:
                                              BorderRadius.circular(10),
                                        ),
                                        child: Icon(
                                          _sectionIcon(section),
                                          color: AppTheme.primaryColor,
                                          size: 18,
                                        ),
                                      ),
                                      const SizedBox(width: 12),
                                      Expanded(
                                        child: Column(
                                          crossAxisAlignment:
                                              CrossAxisAlignment.start,
                                          children: [
                                            Text(
                                              section.toUpperCase(),
                                              style: const TextStyle(
                                                  fontWeight:
                                                      FontWeight.bold,
                                                  letterSpacing: 1),
                                            ),
                                            Text(
                                              '${items.length} item${items.length != 1 ? 's' : ''}',
                                              style: const TextStyle(
                                                  color: AppTheme.textGrey,
                                                  fontSize: 11),
                                            ),
                                          ],
                                        ),
                                      ),
                                      IconButton(
                                        icon: const Icon(LucideIcons.plusCircle,
                                            color: AppTheme.primaryColor,
                                            size: 20),
                                        onPressed: () => _showEditSheet(
                                            defaultSection: section),
                                        tooltip: 'Add to $section',
                                      ),
                                      Icon(
                                        isExpanded
                                            ? LucideIcons.chevronUp
                                            : LucideIcons.chevronDown,
                                        color: AppTheme.textGrey,
                                        size: 18,
                                      ),
                                    ],
                                  ),
                                ),
                              ),

                              // Items list
                              if (isExpanded) ...[
                                const Divider(
                                    height: 1,
                                    color: AppTheme.glassBorder),
                                ...items.map((item) =>
                                    _buildItemTile(item)),
                              ],
                            ],
                          ),
                        );
                      }).toList(),
                    ),
            ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () => _showEditSheet(),
        backgroundColor: AppTheme.primaryColor,
        icon: const Icon(LucideIcons.plus, color: Colors.white),
        label: const Text('Add Content',
            style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
      ),
    );
  }

  Widget _buildItemTile(Map<String, dynamic> item) {
    final key = item['key'] as String? ?? '';
    final value = item['value'] as String? ?? '';
    final type = item['type'] as String? ?? 'text';
    final isSlider = type == 'slider' || _isSlider(key);
    final isImage = type == 'image';

    List<String> sliderImages = [];
    if (isSlider && value.isNotEmpty) {
      try {
        final parsed = jsonDecode(value);
        if (parsed is List) {
          sliderImages = List<String>.from(parsed);
        }
      } catch (_) {}
    }

    return Container(
      decoration: const BoxDecoration(
        border: Border(bottom: BorderSide(color: AppTheme.glassBorder)),
      ),
      child: ListTile(
        contentPadding:
            const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
        leading: Container(
          width: 44,
          height: 44,
          decoration: BoxDecoration(
            color: isSlider
                ? AppTheme.primaryColor.withOpacity(0.1)
                : isImage
                    ? Colors.orangeAccent.withOpacity(0.1)
                    : Colors.blueAccent.withOpacity(0.1),
            borderRadius: BorderRadius.circular(10),
          ),
          child: isSlider
              ? Icon(LucideIcons.layers,
                  size: 20, color: AppTheme.primaryColor)
              : isImage && value.isNotEmpty
                  ? ClipRRect(
                      borderRadius: BorderRadius.circular(10),
                      child: Image.network(value,
                          fit: BoxFit.cover,
                          errorBuilder: (_, __, ___) => Icon(LucideIcons.image,
                              size: 20, color: Colors.orangeAccent)),
                    )
                  : Icon(
                      isImage ? LucideIcons.image : LucideIcons.type,
                      size: 20,
                      color: isImage ? Colors.orangeAccent : Colors.blueAccent,
                    ),
        ),
        title: Text(key,
            style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 13)),
        subtitle: isSlider
            ? Row(
                children: [
                  Text('${sliderImages.length} images',
                      style: const TextStyle(
                          color: AppTheme.primaryColor,
                          fontSize: 10,
                          fontWeight: FontWeight.bold)),
                  const SizedBox(width: 8),
                  Expanded(
                    child: SizedBox(
                      height: 20,
                      child: ListView.separated(
                        scrollDirection: Axis.horizontal,
                        itemCount: sliderImages.length,
                        separatorBuilder: (_, __) => const SizedBox(width: 4),
                        itemBuilder: (context, idx) => Container(
                          width: 20,
                          height: 20,
                          decoration: BoxDecoration(
                            borderRadius: BorderRadius.circular(4),
                            image: DecorationImage(
                              image: NetworkImage(sliderImages[idx]),
                              fit: BoxFit.cover,
                            ),
                          ),
                        ),
                      ),
                    ),
                  ),
                ],
              )
            : Text(
                isImage
                    ? (value.isNotEmpty ? '🔗 Image URL set' : 'No image')
                    : value,
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: const TextStyle(color: AppTheme.textGrey, fontSize: 11),
              ),
        trailing: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            IconButton(
              icon: const Icon(LucideIcons.edit3,
                  size: 18, color: Colors.blueAccent),
              onPressed: () => _showEditSheet(item: item),
            ),
            IconButton(
              icon: const Icon(LucideIcons.trash2,
                  size: 18, color: Colors.redAccent),
              onPressed: () => _delete(item),
            ),
          ],
        ),
      ),
    );
  }

  Widget _emptyState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(LucideIcons.fileText,
              size: 60, color: AppTheme.textGrey.withOpacity(0.3)),
          const SizedBox(height: 16),
          const Text('No content yet',
              style:
                  TextStyle(color: AppTheme.textGrey, fontSize: 16)),
          const SizedBox(height: 8),
          const Text('Tap + to add your first content item',
              style: TextStyle(
                  color: AppTheme.textGrey, fontSize: 12)),
        ],
      ),
    );
  }

  IconData _sectionIcon(String section) {
    const map = {
      'hero': LucideIcons.layout,
      'about': LucideIcons.info,
      'services': LucideIcons.settings,
      'contact': LucideIcons.phone,
      'schedule': LucideIcons.clock,
      'gallery': LucideIcons.image,
      'footer': LucideIcons.alignJustify,
      'general': LucideIcons.globe,
      'banner': LucideIcons.megaphone,
      'home': LucideIcons.home,
    };
    return map[section.toLowerCase()] ?? LucideIcons.fileText;
  }
}
