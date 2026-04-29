import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:powersoul_admin/theme.dart';
import 'package:powersoul_admin/utils/icon_map.dart';
import 'package:lucide_icons/lucide_icons.dart';

class ServicesScreen extends StatefulWidget {
  const ServicesScreen({super.key});

  @override
  State<ServicesScreen> createState() => _ServicesScreenState();
}

class _ServicesScreenState extends State<ServicesScreen> {
  final _supabase = Supabase.instance.client;
  List<dynamic> _services = [];
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _fetchServices();
  }

  Future<void> _fetchServices() async {
    if (!mounted) return;
    setState(() => _loading = true);
    try {
      final data = await _supabase
          .from('services')
          .select()
          .order('order', ascending: true);
      if (mounted) setState(() => _services = data);
    } catch (e) {
      debugPrint('Error: $e');
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  // ── Icon Picker ────────────────────────────────────────────────────────────
  Future<String?> _showIconPicker(String current) async {
    String? picked;
    String search = '';
    String selected = current;

    await showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: AppTheme.darkAlt,
      shape: const RoundedRectangleBorder(
          borderRadius: BorderRadius.vertical(top: Radius.circular(25))),
      builder: (context) => StatefulBuilder(
        builder: (context, setSheet) {
          final filtered = search.isEmpty
              ? IconMap.allIcons
              : IconMap.allIcons
                  .where((i) =>
                      i.label.toLowerCase().contains(search.toLowerCase()))
                  .toList();

          return SizedBox(
            height: MediaQuery.of(context).size.height * 0.75,
            child: Column(
              children: [
                const SizedBox(height: 16),
                Container(
                  width: 40, height: 4,
                  decoration: BoxDecoration(
                    color: Colors.white24,
                    borderRadius: BorderRadius.circular(2),
                  ),
                ),
                const SizedBox(height: 16),
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 20),
                  child: Row(
                    children: [
                      const Text('Choose Icon',
                          style: TextStyle(
                              fontSize: 18, fontWeight: FontWeight.bold)),
                      const Spacer(),
                      TextButton(
                        onPressed: () {
                          picked = selected;
                          Navigator.pop(context);
                        },
                        child: const Text('Done',
                            style: TextStyle(color: AppTheme.primaryColor)),
                      ),
                    ],
                  ),
                ),
                Padding(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
                  child: TextField(
                    decoration: const InputDecoration(
                      hintText: 'Search icons…',
                      prefixIcon:
                          Icon(LucideIcons.search, size: 18),
                      contentPadding: EdgeInsets.symmetric(vertical: 12),
                    ),
                    onChanged: (v) => setSheet(() => search = v),
                  ),
                ),
                Expanded(
                  child: GridView.builder(
                    padding: const EdgeInsets.fromLTRB(20, 8, 20, 20),
                    gridDelegate:
                        const SliverGridDelegateWithFixedCrossAxisCount(
                      crossAxisCount: 4,
                      crossAxisSpacing: 12,
                      mainAxisSpacing: 12,
                      childAspectRatio: 0.85,
                    ),
                    itemCount: filtered.length,
                    itemBuilder: (context, index) {
                      final gi = filtered[index];
                      final isSelected = gi.faClass == selected;
                      return GestureDetector(
                        onTap: () => setSheet(() => selected = gi.faClass),
                        child: AnimatedContainer(
                          duration: const Duration(milliseconds: 200),
                          decoration: BoxDecoration(
                            color: isSelected
                                ? AppTheme.primaryColor.withOpacity(0.2)
                                : Colors.white.withOpacity(0.04),
                            borderRadius: BorderRadius.circular(12),
                            border: Border.all(
                              color: isSelected
                                  ? AppTheme.primaryColor
                                  : Colors.white12,
                              width: isSelected ? 2 : 1,
                            ),
                          ),
                          child: Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Icon(gi.iconData,
                                  size: 26,
                                  color: isSelected
                                      ? AppTheme.primaryColor
                                      : AppTheme.textGrey),
                              const SizedBox(height: 6),
                              Text(gi.label,
                                  textAlign: TextAlign.center,
                                  maxLines: 1,
                                  overflow: TextOverflow.ellipsis,
                                  style: TextStyle(
                                    fontSize: 9,
                                    color: isSelected
                                        ? AppTheme.primaryColor
                                        : AppTheme.textGrey,
                                  )),
                            ],
                          ),
                        ),
                      );
                    },
                  ),
                ),
              ],
            ),
          );
        },
      ),
    );
    return picked;
  }

  // ── Add / Edit Sheet ───────────────────────────────────────────────────────
  void _showEditServiceSheet(Map<String, dynamic>? service) {
    final titleController =
        TextEditingController(text: service?['title'] ?? '');
    final descController =
        TextEditingController(text: service?['description'] ?? '');
    String selectedIcon = service?['icon'] ?? 'fas fa-dumbbell';

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: AppTheme.darkAlt,
      shape: const RoundedRectangleBorder(
          borderRadius: BorderRadius.vertical(top: Radius.circular(25))),
      builder: (context) => StatefulBuilder(
        builder: (context, setSheet) => Padding(
          padding: EdgeInsets.only(
            bottom: MediaQuery.of(context).viewInsets.bottom,
            left: 20, right: 20, top: 20,
          ),
          child: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                Row(
                  children: [
                    Container(
                      width: 46, height: 46,
                      decoration: BoxDecoration(
                        color: AppTheme.primaryColor.withOpacity(0.15),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Icon(IconMap.getIcon(selectedIcon),
                          color: AppTheme.primaryColor),
                    ),
                    const SizedBox(width: 14),
                    Text(
                      service == null ? 'Add Service' : 'Edit Service',
                      style: const TextStyle(
                          fontSize: 20, fontWeight: FontWeight.bold),
                    ),
                  ],
                ),
                const SizedBox(height: 20),
                TextField(
                  controller: titleController,
                  decoration:
                      const InputDecoration(labelText: 'Service Title'),
                ),
                const SizedBox(height: 15),
                TextField(
                  controller: descController,
                  decoration:
                      const InputDecoration(labelText: 'Description'),
                  maxLines: 3,
                ),
                const SizedBox(height: 15),

                // Icon picker row
                GestureDetector(
                  onTap: () async {
                    final result = await _showIconPicker(selectedIcon);
                    if (result != null) {
                      setSheet(() => selectedIcon = result);
                    }
                  },
                  child: Container(
                    padding: const EdgeInsets.all(14),
                    decoration: BoxDecoration(
                      color: Colors.white.withOpacity(0.05),
                      borderRadius: BorderRadius.circular(15),
                      border: Border.all(color: AppTheme.glassBorder),
                    ),
                    child: Row(
                      children: [
                        Container(
                          width: 42, height: 42,
                          decoration: BoxDecoration(
                            color: AppTheme.primaryColor.withOpacity(0.1),
                            borderRadius: BorderRadius.circular(10),
                          ),
                          child: Icon(IconMap.getIcon(selectedIcon),
                              color: AppTheme.primaryColor, size: 22),
                        ),
                        const SizedBox(width: 14),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const Text('Service Icon',
                                  style: TextStyle(
                                      color: AppTheme.textGrey,
                                      fontSize: 12)),
                              const SizedBox(height: 2),
                              Text(
                                IconMap.allIcons
                                        .where(
                                            (i) => i.faClass == selectedIcon)
                                        .firstOrNull
                                        ?.label ??
                                    selectedIcon,
                                style: const TextStyle(
                                    fontWeight: FontWeight.w600),
                              ),
                            ],
                          ),
                        ),
                        const Icon(LucideIcons.chevronRight,
                            color: AppTheme.textGrey, size: 18),
                      ],
                    ),
                  ),
                ),

                const SizedBox(height: 25),
                ElevatedButton(
                  onPressed: () async {
                    final data = {
                      'title': titleController.text.trim(),
                      'description': descController.text.trim(),
                      'icon': selectedIcon,
                      'order': service?['order'] ?? _services.length,
                    };
                    if (service == null) {
                      await _supabase.from('services').insert(data);
                    } else {
                      await _supabase
                          .from('services')
                          .update(data)
                          .eq('id', service['id']);
                    }
                    if (context.mounted) Navigator.pop(context);
                    _fetchServices();
                  },
                  child: Text(service == null
                      ? 'CREATE SERVICE'
                      : 'UPDATE SERVICE'),
                ),
                const SizedBox(height: 30),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Future<void> _deleteService(Map<String, dynamic> service) async {
    final confirm = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: AppTheme.darkAlt,
        title: const Text('Delete Service'),
        content: Text(
            'Remove "${service['title']}" permanently?'),
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
    if (confirm != true) return;
    try {
      await _supabase
          .from('services')
          .delete()
          .eq('id', service['id']);
      _fetchServices();
    } catch (e) {
      debugPrint('Error: $e');
    }
  }

  // ── Build ──────────────────────────────────────────────────────────────────
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Gym Services'),
        actions: [
          IconButton(
            icon: const Icon(LucideIcons.plus,
                color: AppTheme.primaryColor),
            onPressed: () => _showEditServiceSheet(null),
          ),
        ],
      ),
      body: _loading
          ? const Center(child: CircularProgressIndicator())
          : RefreshIndicator(
              onRefresh: _fetchServices,
              child: _services.isEmpty
                  ? const Center(
                      child: Text('No services yet',
                          style: TextStyle(color: AppTheme.textGrey)))
                  : ReorderableListView.builder(
                      padding: const EdgeInsets.all(20),
                      itemCount: _services.length,
                      onReorder: (oldIdx, newIdx) async {
                        if (newIdx > oldIdx) newIdx--;
                        setState(() {
                          final item = _services.removeAt(oldIdx);
                          _services.insert(newIdx, item);
                        });
                        // persist new order
                        for (int i = 0; i < _services.length; i++) {
                          await _supabase
                              .from('services')
                              .update({'order': i})
                              .eq('id', _services[i]['id']);
                        }
                      },
                      itemBuilder: (context, index) {
                        final service = _services[index];
                        final iconData =
                            IconMap.getIcon(service['icon']);
                        return Container(
                          key: ValueKey(service['id']),
                          margin: const EdgeInsets.only(bottom: 15),
                          decoration: BoxDecoration(
                            color: AppTheme.darkAlt,
                            borderRadius: BorderRadius.circular(20),
                            border: Border.all(
                                color: AppTheme.glassBorder),
                          ),
                          child: ListTile(
                            contentPadding:
                                const EdgeInsets.symmetric(
                                    horizontal: 20, vertical: 10),
                            leading: Container(
                              width: 50, height: 50,
                              decoration: BoxDecoration(
                                gradient: LinearGradient(
                                  colors: [
                                    AppTheme.primaryColor
                                        .withOpacity(0.25),
                                    AppTheme.primaryColor
                                        .withOpacity(0.08),
                                  ],
                                  begin: Alignment.topLeft,
                                  end: Alignment.bottomRight,
                                ),
                                borderRadius:
                                    BorderRadius.circular(12),
                                border: Border.all(
                                    color: AppTheme.primaryColor
                                        .withOpacity(0.3)),
                              ),
                              child: Icon(iconData,
                                  color: AppTheme.primaryColor,
                                  size: 22),
                            ),
                            title: Text(service['title'] ?? '',
                                style: const TextStyle(
                                    fontWeight: FontWeight.bold)),
                            subtitle: Text(
                              service['description'] ?? '',
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                              style: const TextStyle(
                                  color: AppTheme.textGrey,
                                  fontSize: 12),
                            ),
                            trailing: Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                IconButton(
                                  icon: const Icon(LucideIcons.edit3,
                                      size: 20,
                                      color: Colors.blueAccent),
                                  onPressed: () =>
                                      _showEditServiceSheet(service),
                                ),
                                IconButton(
                                  icon: const Icon(LucideIcons.trash2,
                                      size: 20,
                                      color: Colors.redAccent),
                                  onPressed: () =>
                                      _deleteService(service),
                                ),
                              ],
                            ),
                          ),
                        );
                      },
                    ),
            ),
    );
  }
}
