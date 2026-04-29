import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:powersoul_admin/theme.dart';
import 'package:powersoul_admin/screens/schedules_screen.dart';
import 'package:powersoul_admin/screens/banners_screen.dart';
import 'package:powersoul_admin/screens/services_screen.dart';
import 'package:powersoul_admin/screens/sections_screen.dart';
import 'package:powersoul_admin/screens/gallery_screen.dart';
import 'package:powersoul_admin/screens/pages_screen.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:url_launcher/url_launcher.dart';

class DashboardScreen extends StatelessWidget {
  const DashboardScreen({super.key});

  Future<void> _signOut(BuildContext context) async {
    await Supabase.instance.client.auth.signOut();
    if (context.mounted) {
      Navigator.of(context).pushReplacementNamed('/');
    }
  }

  Future<void> _launchURL() async {
    final Uri url = Uri.parse('https://powersoulfitness.com');
    if (!await launchUrl(url, mode: LaunchMode.externalApplication)) {
      debugPrint('Could not launch $url');
    }
  }

  @override
  Widget build(BuildContext context) {
    final cards = [
      _CardData(
        title: 'Schedules',
        subtitle: 'Hours & timings',
        icon: LucideIcons.clock,
        color: AppTheme.primaryColor,
        screen: const SchedulesScreen(),
      ),
      _CardData(
        title: 'Banners',
        subtitle: 'Ads & promotions',
        icon: LucideIcons.megaphone,
        color: AppTheme.accentColor,
        screen: const BannersScreen(),
      ),
      _CardData(
        title: 'Services',
        subtitle: 'Gym offerings',
        icon: LucideIcons.dumbbell,
        color: Colors.blueAccent,
        screen: const ServicesScreen(),
      ),
      _CardData(
        title: 'Gallery',
        subtitle: 'Photos & media',
        icon: LucideIcons.image,
        color: Colors.orangeAccent,
        screen: const GalleryScreen(),
      ),
      _CardData(
        title: 'Page Content',
        subtitle: 'Texts & images',
        icon: LucideIcons.fileText,
        color: Colors.tealAccent,
        screen: const PagesScreen(),
      ),
      _CardData(
        title: 'Sections',
        subtitle: 'Show / hide',
        icon: LucideIcons.layers,
        color: Colors.greenAccent,
        screen: const SectionsScreen(),
      ),
    ];

    return Scaffold(
      appBar: AppBar(
        backgroundColor: AppTheme.darkBg,
        title: Row(
          children: [
            Container(
              width: 32,
              height: 32,
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [AppTheme.primaryColor, AppTheme.accentColor],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(8),
              ),
              child: const Icon(LucideIcons.zap,
                  color: Colors.white, size: 18),
            ),
            const SizedBox(width: 10),
            const Text('PSF Admin',
                style: TextStyle(fontWeight: FontWeight.bold)),
          ],
        ),
        actions: [
          IconButton(
            icon: const Icon(LucideIcons.logOut, color: Colors.redAccent),
            onPressed: () => _signOut(context),
            tooltip: 'Sign out',
          ),
        ],
      ),
      body: Padding(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Greeting
            const Text(
              'Welcome back 👋',
              style: TextStyle(
                  fontSize: 24,
                  fontWeight: FontWeight.bold,
                  color: Colors.white),
            ),
            const Text(
              'What would you like to manage today?',
              style: TextStyle(color: AppTheme.textGrey),
            ),
            const SizedBox(height: 24),

            // Grid
            Expanded(
              child: GridView.builder(
                gridDelegate:
                    const SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: 2,
                  crossAxisSpacing: 16,
                  mainAxisSpacing: 16,
                  childAspectRatio: 1.0,
                ),
                itemCount: cards.length,
                itemBuilder: (context, index) =>
                    _buildCard(context, cards[index]),
              ),
            ),
          ],
        ),
      ),
      bottomNavigationBar: Container(
        padding: const EdgeInsets.fromLTRB(20, 0, 20, 20),
        color: Colors.transparent,
        child: ElevatedButton.icon(
          onPressed: _launchURL,
          icon: const Icon(LucideIcons.globe, size: 20),
          label: const Text('VISIT POWERSOULFITNESS.COM'),
          style: ElevatedButton.styleFrom(
            backgroundColor: AppTheme.accentColor,
            minimumSize: const Size(double.infinity, 56),
            elevation: 8,
            shadowColor: AppTheme.accentColor.withOpacity(0.3),
          ),
        ),
      ),
    );
  }

  Widget _buildCard(BuildContext context, _CardData data) {
    return InkWell(
      onTap: () => Navigator.push(
        context,
        MaterialPageRoute(builder: (_) => data.screen),
      ),
      borderRadius: BorderRadius.circular(20),
      child: Container(
        decoration: BoxDecoration(
          color: AppTheme.darkAlt,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: AppTheme.glassBorder),
          boxShadow: [
            BoxShadow(
              color: data.color.withOpacity(0.06),
              blurRadius: 12,
              offset: const Offset(0, 6),
            ),
          ],
        ),
        child: Stack(
          children: [
            // subtle glow circle
            Positioned(
              top: -20,
              right: -20,
              child: Container(
                width: 80,
                height: 80,
                decoration: BoxDecoration(
                  color: data.color.withOpacity(0.08),
                  shape: BoxShape.circle,
                ),
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(18),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Container(
                    width: 44,
                    height: 44,
                    decoration: BoxDecoration(
                      color: data.color.withOpacity(0.15),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Icon(data.icon,
                        size: 22, color: data.color),
                  ),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        data.title,
                        style: const TextStyle(
                          fontSize: 15,
                          fontWeight: FontWeight.bold,
                          color: Colors.white,
                        ),
                      ),
                      const SizedBox(height: 2),
                      Text(
                        data.subtitle,
                        style: const TextStyle(
                          fontSize: 11,
                          color: AppTheme.textGrey,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _CardData {
  final String title;
  final String subtitle;
  final IconData icon;
  final Color color;
  final Widget screen;
  const _CardData({
    required this.title,
    required this.subtitle,
    required this.icon,
    required this.color,
    required this.screen,
  });
}
