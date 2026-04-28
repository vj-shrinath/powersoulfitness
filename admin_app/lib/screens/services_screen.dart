import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:powersoul_admin/theme.dart';
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
      if (mounted) {
        setState(() => _services = data);
      }
    } catch (e) {
      debugPrint('Error: $e');
    } finally {
      if (mounted) {
        setState(() => _loading = false);
      }
    }
  }

  void _showEditServiceSheet(Map<String, dynamic>? service) {
    final titleController = TextEditingController(text: service?['title'] ?? '');
    final descController = TextEditingController(text: service?['description'] ?? '');
    final iconController = TextEditingController(text: service?['icon'] ?? 'fas fa-dumbbell');

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: AppTheme.darkAlt,
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(25))),
      builder: (context) => Padding(
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
              Text(service == null ? 'Add Service' : 'Edit Service', style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
              const SizedBox(height: 20),
              TextField(
                controller: titleController,
                decoration: const InputDecoration(labelText: 'Service Title'),
              ),
              const SizedBox(height: 15),
              TextField(
                controller: descController,
                decoration: const InputDecoration(labelText: 'Description'),
                maxLines: 3,
              ),
              const SizedBox(height: 15),
              TextField(
                controller: iconController,
                decoration: const InputDecoration(labelText: 'Icon Class (FontAwesome)', hintText: 'fas fa-dumbbell'),
              ),
              const SizedBox(height: 25),
              ElevatedButton(
                onPressed: () async {
                  final data = {
                    'title': titleController.text,
                    'description': descController.text,
                    'icon': iconController.text,
                    'order': service?['order'] ?? _services.length,
                  };

                  if (service == null) {
                    await _supabase.from('services').insert(data);
                  } else {
                    await _supabase.from('services').update(data).eq('id', service['id']);
                  }
                  
                  if (context.mounted) Navigator.pop(context);
                  _fetchServices();
                },
                child: Text(service == null ? 'CREATE SERVICE' : 'UPDATE SERVICE'),
              ),
              const SizedBox(height: 30),
            ],
          ),
        ),
      ),
    );
  }

  Future<void> _deleteService(String id) async {
    try {
      await _supabase.from('services').delete().eq('id', id);
      _fetchServices();
    } catch (e) {
      debugPrint('Error: $e');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Gym Services'),
        actions: [
          IconButton(
            icon: const Icon(LucideIcons.plus, color: AppTheme.primaryColor),
            onPressed: () => _showEditServiceSheet(null),
          ),
        ],
      ),
      body: _loading
          ? const Center(child: CircularProgressIndicator())
          : ListView.builder(
              padding: const EdgeInsets.all(20),
              itemCount: _services.length,
              itemBuilder: (context, index) {
                final service = _services[index];
                return Container(
                  margin: const EdgeInsets.only(bottom: 15),
                  decoration: BoxDecoration(
                    color: AppTheme.darkAlt,
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(color: AppTheme.glassBorder),
                  ),
                  child: ListTile(
                    contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
                    leading: Container(
                      width: 50,
                      height: 50,
                      decoration: BoxDecoration(
                        color: AppTheme.primaryColor.withOpacity(0.1),
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: const Icon(LucideIcons.dumbbell, color: AppTheme.primaryColor),
                    ),
                    title: Text(service['title'] ?? '', style: const TextStyle(fontWeight: FontWeight.bold)),
                    subtitle: Text(
                      service['description'] ?? '',
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: const TextStyle(color: AppTheme.textGrey, fontSize: 12),
                    ),
                    trailing: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        IconButton(
                          icon: const Icon(LucideIcons.edit3, size: 20, color: Colors.blueAccent),
                          onPressed: () => _showEditServiceSheet(service),
                        ),
                        IconButton(
                          icon: const Icon(LucideIcons.trash2, size: 20, color: Colors.redAccent),
                          onPressed: () => _deleteService(service['id']),
                        ),
                      ],
                    ),
                  ),
                );
              },
            ),
    );
  }
}
