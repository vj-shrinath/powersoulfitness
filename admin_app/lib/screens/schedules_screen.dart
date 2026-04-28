import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:powersoul_admin/theme.dart';
import 'package:lucide_icons/lucide_icons.dart';

class SchedulesScreen extends StatefulWidget {
  const SchedulesScreen({super.key});

  @override
  State<SchedulesScreen> createState() => _SchedulesScreenState();
}

class _SchedulesScreenState extends State<SchedulesScreen> {
  final _gymHoursController = TextEditingController();
  final _sundayStatusController = TextEditingController();
  bool _loading = true;
  bool _saving = false;
  final _supabase = Supabase.instance.client;

  @override
  void initState() {
    super.initState();
    _fetchData();
  }

  Future<void> _fetchData() async {
    try {
      final response = await _supabase
          .from('content')
          .select()
          .filter('key', 'in', '("schedule_gym_hours", "schedule_sunday_status")');

      for (var item in response) {
        if (item['key'] == 'schedule_gym_hours') {
          _gymHoursController.text = item['value'];
        } else if (item['key'] == 'schedule_sunday_status') {
          _sundayStatusController.text = item['value'];
        }
      }
    } catch (e) {
      debugPrint('Error fetching: $e');
    } finally {
      if (mounted) {
        setState(() => _loading = false);
      }
    }
  }

  Future<void> _saveData() async {
    setState(() => _saving = true);
    try {
      await _supabase.from('content').upsert([
        {
          'key': 'schedule_gym_hours',
          'value': _gymHoursController.text,
          'type': 'text',
          'updated_at': DateTime.now().toIso8601String(),
        },
        {
          'key': 'schedule_sunday_status',
          'value': _sundayStatusController.text,
          'type': 'text',
          'updated_at': DateTime.now().toIso8601String(),
        }
      ], onConflict: 'key');

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Schedules updated successfully!'), backgroundColor: Colors.green),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error saving: $e'), backgroundColor: Colors.red),
        );
      }
    } finally {
      if (mounted) {
        setState(() => _saving = false);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Gym Schedules'),
        actions: [
          if (!_loading)
            TextButton.icon(
              onPressed: _saving ? null : _saveData,
              icon: _saving 
                ? const SizedBox(width: 16, height: 16, child: CircularProgressIndicator(strokeWidth: 2)) 
                : const Icon(LucideIcons.save, color: AppTheme.primaryColor),
              label: const Text('Save', style: TextStyle(color: AppTheme.primaryColor)),
            ),
        ],
      ),
      body: _loading
          ? const Center(child: CircularProgressIndicator())
          : SingleChildScrollView(
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _buildSectionHeader('Opening Hours', LucideIcons.clock),
                  const SizedBox(height: 15),
                  TextField(
                    controller: _gymHoursController,
                    decoration: const InputDecoration(
                      labelText: 'Monday - Saturday',
                      hintText: 'e.g. 5AM - 9AM | 5PM - 9PM',
                    ),
                    style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 30),
                  _buildSectionHeader('Sunday Availability', LucideIcons.calendar),
                  const SizedBox(height: 15),
                  TextField(
                    controller: _sundayStatusController,
                    decoration: const InputDecoration(
                      labelText: 'Sunday Status',
                      hintText: 'e.g. CLOSED',
                    ),
                    style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 40),
                  const Text(
                    'Note: Changes here will instantly update the homepage schedule section.',
                    style: TextStyle(color: AppTheme.textGrey, fontStyle: FontStyle.italic),
                  ),
                ],
              ),
            ),
    );
  }

  Widget _buildSectionHeader(String title, IconData icon) {
    return Row(
      children: [
        Icon(icon, color: AppTheme.primaryColor, size: 20),
        const SizedBox(width: 10),
        Text(
          title,
          style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, letterSpacing: 1),
        ),
      ],
    );
  }
}
