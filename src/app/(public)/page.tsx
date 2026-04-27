import HomeClient from "@/components/HomeClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Best Gym in Lonar | Power Soul Fitness - Transform Your Life",
  description: "Join Power Soul Fitness in Lonar, Maharashtra. The most equipped gym for bodybuilding, weight loss, and personal training. Get your free trial today!",
};

export default function Home() {
  return <HomeClient />;
}
