import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:powersoul_admin/theme.dart';
import 'package:lucide_icons/lucide_icons.dart';

class SectionsScreen extends StatefulWidget {
  const SectionsScreen({super.key});

  @override
  State<SectionsScreen> createState() => _SectionsScreenState();
}

class _SectionsScreenState extends State<SectionsScreen> {
  final _supabase = Supabase.instance.client;
  List<dynamic> _sections = [];
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _fetchSections();
  }

  Future<void> _fetchSections() async {
    if (!mounted) return;
    setState(() => _loading = true);
    try {
      final data = await _supabase
          .from('sections')
          .select()
          .order('order', ascending: true);
      if (mounted) {
        setState(() => _sections = data);
      }
    } catch (e) {
      debugPrint('Error: $e');
    } finally {
      if (mounted) {
        setState(() => _loading = false);
      }
    }
  }

  Future<void> _toggleSection(String id, bool currentStatus) async {
    try {
      await _supabase
          .from('sections')
          .update({'enabled': !currentStatus})
          .eq('id', id);
      _fetchSections();
    } catch (e) {
      debugPrint('Error: $e');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Site Sections'),
      ),
      body: _loading
          ? const Center(child: CircularProgressIndicator())
          : ListView.builder(
              padding: const EdgeInsets.all(20),
              itemCount: _sections.length,
              itemBuilder: (context, index) {
                final section = _sections[index];
                final bool isEnabled = section['enabled'] ?? true;
                return Container(
                  margin: const EdgeInsets.only(bottom: 15),
                  decoration: BoxDecoration(
                    color: AppTheme.darkAlt,
                    borderRadius: BorderRadius.circular(15),
                    border: Border.all(color: isEnabled ? AppTheme.primaryColor.withOpacity(0.2) : AppTheme.glassBorder),
                  ),
                  child: ListTile(
                    contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 5),
                    title: Text(
                      section['name']?.toUpperCase() ?? '',
                      style: const TextStyle(fontWeight: FontWeight.bold, letterSpacing: 1),
                    ),
                    subtitle: Text(
                      isEnabled ? 'VISIBLE ON HOMEPAGE' : 'HIDDEN FROM PUBLIC',
                      style: TextStyle(
                        fontSize: 10,
                        color: isEnabled ? Colors.greenAccent : AppTheme.textGrey,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    trailing: Switch(
                      value: isEnabled,
                      activeTrackColor: AppTheme.primaryColor,
                      onChanged: (val) => _toggleSection(section['id'].toString(), isEnabled),
                    ),
                  ),
                );
              },
            ),
    );
  }
}
