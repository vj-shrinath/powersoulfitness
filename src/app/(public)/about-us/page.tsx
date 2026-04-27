import AboutUsClient from "./AboutUsClient";
import { Metadata } from "next";

export const runtime = "edge";

export const metadata: Metadata = {
  title: "About Power Soul Fitness | Best Gym in Lonar",
  description: "Learn about Power Soul Fitness Lonar. Our mission is to provide expert guidance on fitness and nutrition. Led by Shiv Mapari, we are the top fitness destination in the region.",
};

export default function AboutUsPage() {
  return <AboutUsClient />;
}
