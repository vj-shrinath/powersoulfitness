export const runtime = "edge";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Best Gym Services in Lonar | Power Soul Fitness',
  description: "Power Soul Fitness offers top gym services in Lonar including Bodybuilding, Crossfit, Yoga, Personal Training, Steam Bath, and exclusive Ladies Batches. Join Lonar's best fitness center today!",
  keywords: 'gym in Lonar, best gym Lonar, fitness center Lonar, bodybuilding Lonar, yoga Lonar, personal trainer Lonar, ladies gym Lonar, crossfit Lonar',
};

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
