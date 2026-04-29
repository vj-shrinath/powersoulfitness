import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';

class GymIcon {
  final String faClass;
  final IconData iconData;
  final String label;
  const GymIcon({required this.faClass, required this.iconData, required this.label});
}

class IconMap {
  static final List<GymIcon> allIcons = [
    GymIcon(faClass: 'fas fa-dumbbell',     iconData: LucideIcons.dumbbell,    label: 'Dumbbell'),
    GymIcon(faClass: 'fas fa-heartbeat',    iconData: LucideIcons.activity,    label: 'Cardio'),
    GymIcon(faClass: 'fas fa-heart',        iconData: LucideIcons.heart,       label: 'Health'),
    GymIcon(faClass: 'fas fa-fire',         iconData: LucideIcons.flame,       label: 'Burn'),
    GymIcon(faClass: 'fas fa-award',        iconData: LucideIcons.award,       label: 'Award'),
    GymIcon(faClass: 'fas fa-trophy',       iconData: LucideIcons.trophy,      label: 'Trophy'),
    GymIcon(faClass: 'fas fa-bicycle',      iconData: LucideIcons.bike,        label: 'Cycling'),
    GymIcon(faClass: 'fas fa-apple-alt',    iconData: LucideIcons.apple,       label: 'Nutrition'),
    GymIcon(faClass: 'fas fa-brain',        iconData: LucideIcons.brain,       label: 'Mental'),
    GymIcon(faClass: 'fas fa-users',        iconData: LucideIcons.users,       label: 'Group'),
    GymIcon(faClass: 'fas fa-user',         iconData: LucideIcons.user,        label: 'Personal'),
    GymIcon(faClass: 'fas fa-star',         iconData: LucideIcons.star,        label: 'Premium'),
    GymIcon(faClass: 'fas fa-clock',        iconData: LucideIcons.clock,       label: 'Timed'),
    GymIcon(faClass: 'fas fa-bolt',         iconData: LucideIcons.zap,         label: 'Power'),
    GymIcon(faClass: 'fas fa-target',       iconData: LucideIcons.target,      label: 'Goals'),
    GymIcon(faClass: 'fas fa-chart-line',   iconData: LucideIcons.trendingUp,  label: 'Progress'),
    GymIcon(faClass: 'fas fa-music',        iconData: LucideIcons.music,       label: 'Music'),
    GymIcon(faClass: 'fas fa-shield-alt',   iconData: LucideIcons.shield,      label: 'Safety'),
    GymIcon(faClass: 'fas fa-leaf',         iconData: LucideIcons.leaf,        label: 'Yoga'),
    GymIcon(faClass: 'fas fa-sun',          iconData: LucideIcons.sun,         label: 'Morning'),
    GymIcon(faClass: 'fas fa-moon',         iconData: LucideIcons.moon,        label: 'Evening'),
    GymIcon(faClass: 'fas fa-map-marker',   iconData: LucideIcons.mapPin,      label: 'Location'),
    GymIcon(faClass: 'fas fa-phone',        iconData: LucideIcons.phone,       label: 'Contact'),
    GymIcon(faClass: 'fas fa-calendar',     iconData: LucideIcons.calendar,    label: 'Schedule'),
    GymIcon(faClass: 'fas fa-cog',          iconData: LucideIcons.settings,    label: 'Config'),
    GymIcon(faClass: 'fas fa-home',         iconData: LucideIcons.home,        label: 'Home'),
    GymIcon(faClass: 'fas fa-envelope',     iconData: LucideIcons.mail,        label: 'Email'),
    GymIcon(faClass: 'fas fa-tools',        iconData: LucideIcons.wrench,      label: 'Equipment'),
    GymIcon(faClass: 'fas fa-chart-bar',    iconData: LucideIcons.barChart2,   label: 'Stats'),
    GymIcon(faClass: 'fas fa-check-circle', iconData: LucideIcons.checkCircle, label: 'Verified'),
    GymIcon(faClass: 'fas fa-flag',         iconData: LucideIcons.flag,        label: 'Milestone'),
    GymIcon(faClass: 'fas fa-layer-group',  iconData: LucideIcons.layers,      label: 'Programs'),
    GymIcon(faClass: 'fas fa-headphones',   iconData: LucideIcons.headphones,  label: 'Audio'),
    GymIcon(faClass: 'fas fa-wind',         iconData: LucideIcons.wind,        label: 'Breathing'),
    GymIcon(faClass: 'fas fa-thermometer',  iconData: LucideIcons.thermometer, label: 'Health'),
    GymIcon(faClass: 'fas fa-coffee',       iconData: LucideIcons.coffee,      label: 'Energy'),
    GymIcon(faClass: 'fas fa-gift',         iconData: LucideIcons.gift,        label: 'Offers'),
    GymIcon(faClass: 'fas fa-tag',          iconData: LucideIcons.tag,         label: 'Pricing'),
    GymIcon(faClass: 'fas fa-key',          iconData: LucideIcons.key,         label: 'Access'),
    GymIcon(faClass: 'fas fa-percent',      iconData: LucideIcons.percent,     label: 'Discount'),
    GymIcon(faClass: 'fas fa-image',        iconData: LucideIcons.image,       label: 'Photo'),
    GymIcon(faClass: 'fas fa-video',        iconData: LucideIcons.video,       label: 'Video'),
    GymIcon(faClass: 'fas fa-running',      iconData: LucideIcons.personStanding, label: 'Running'),
    GymIcon(faClass: 'fas fa-weight',       iconData: LucideIcons.scale,       label: 'Weight'),
    GymIcon(faClass: 'fas fa-spa',          iconData: LucideIcons.feather,     label: 'Spa'),
  ];

  static IconData getIcon(String? faClass) {
    if (faClass == null || faClass.isEmpty) return LucideIcons.dumbbell;
    final found = allIcons.where((i) => i.faClass == faClass).firstOrNull;
    return found?.iconData ?? LucideIcons.dumbbell;
  }
}
