import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:powersoul_admin/theme.dart';
import 'package:powersoul_admin/screens/schedules_screen.dart';
import 'package:powersoul_admin/screens/banners_screen.dart';
import 'package:powersoul_admin/screens/services_screen.dart';
import 'package:powersoul_admin/screens/sections_screen.dart';
import 'package:powersoul_admin/screens/gallery_screen.dart';
import 'package:lucide_icons/lucide_icons.dart';

class DashboardScreen extends StatelessWidget {
  const DashboardScreen({super.key});

  Future<void> _signOut(BuildContext context) async {
    await Supabase.instance.client.auth.signOut();
    if (context.mounted) {
      Navigator.of(context).pushReplacementNamed('/');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: AppTheme.darkBg,
        title: const Text('PSF Dashboard', style: TextStyle(fontWeight: FontWeight.bold)),
        actions: [
          IconButton(
            icon: const Icon(LucideIcons.logOut, color: Colors.redAccent),
            onPressed: () => _signOut(context),
          ),
        ],
      ),
      body: Padding(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Welcome, Admin',
              style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: Colors.white),
            ),
            const Text(
              'What would you like to manage today?',
              style: TextStyle(color: AppTheme.textGrey),
            ),
            const SizedBox(height: 30),
            Expanded(
              child: GridView.count(
                crossAxisCount: 2,
                crossAxisSpacing: 20,
                mainAxisSpacing: 20,
                children: [
                  _buildDashboardCard(
                    context,
                    title: 'Schedules',
                    icon: LucideIcons.clock,
                    color: AppTheme.primaryColor,
                    onTap: () => Navigator.push(
                      context,
                      MaterialPageRoute(builder: (context) => const SchedulesScreen()),
                    ),
                  ),
                  _buildDashboardCard(
                    context,
                    title: 'Banners',
                    icon: LucideIcons.megaphone,
                    color: AppTheme.accentColor,
                    onTap: () => Navigator.push(
                      context,
                      MaterialPageRoute(builder: (context) => const BannersScreen()),
                    ),
                  ),
                  _buildDashboardCard(
                    context,
                    title: 'Services',
                    icon: LucideIcons.settings,
                    color: Colors.blueAccent,
                    onTap: () => Navigator.push(
                      context,
                      MaterialPageRoute(builder: (context) => const ServicesScreen()),
                    ),
                  ),
                  _buildDashboardCard(
                    context,
                    title: 'Gallery',
                    icon: LucideIcons.image,
                    color: Colors.orangeAccent,
                    onTap: () => Navigator.push(
                      context,
                      MaterialPageRoute(builder: (context) => const GalleryScreen()),
                    ),
                  ),
                  _buildDashboardCard(
                    context,
                    title: 'Sections',
                    icon: LucideIcons.layers,
                    color: Colors.greenAccent,
                    onTap: () => Navigator.push(
                      context,
                      MaterialPageRoute(builder: (context) => const SectionsScreen()),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildDashboardCard(
    BuildContext context, {
    required String title,
    required IconData icon,
    required Color color,
    required VoidCallback onTap,
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(20),
      child: Container(
        decoration: BoxDecoration(
          color: AppTheme.darkAlt,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: AppTheme.glassBorder),
          boxShadow: [
            BoxShadow(
              color: color.withOpacity(0.05),
              blurRadius: 10,
              offset: const Offset(0, 5),
            ),
          ],
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(icon, size: 40, color: color),
            const SizedBox(height: 15),
            Text(
              title,
              style: const TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.bold,
                color: Colors.white,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
