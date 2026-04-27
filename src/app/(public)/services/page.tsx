import ServicesClient from "./ServicesClient";
import { Metadata } from "next";

export const runtime = "edge";

export const metadata: Metadata = {
  title: "Fitness Services in Lonar | Bodybuilding & Personal Training",
  description: "Explore premium fitness services at Power Soul Fitness Lonar. We offer bodybuilding, personal training, self-defense classes, and state-of-the-art equipment.",
};

export default function ServicesPage() {
  return <ServicesClient />;
}
