import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:powersoul_admin/theme.dart';
import 'package:powersoul_admin/screens/login_screen.dart';
import 'package:powersoul_admin/screens/dashboard_screen.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  await Supabase.initialize(
    url: 'https://lbgpcwuqxtpibzorpzsh.supabase.co',
    anonKey: 'sb_publishable_lwGFQ3wuxq-fX-fA27KXIQ_UZvXMWph',
  );

  runApp(const PowerSoulAdmin());
}

class PowerSoulAdmin extends StatelessWidget {
  const PowerSoulAdmin({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'PSF Admin',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.darkTheme,
      home: const AuthWrapper(),
    );
  }
}

class AuthWrapper extends StatelessWidget {
  const AuthWrapper({super.key});

  @override
  Widget build(BuildContext context) {
    final session = Supabase.instance.client.auth.currentSession;
    if (session != null) {
      return const DashboardScreen();
    } else {
      return const LoginScreen();
    }
  }
}
