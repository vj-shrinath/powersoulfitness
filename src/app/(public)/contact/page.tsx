import ContactClient from "./ContactClient";
import { Metadata } from "next";

export const runtime = "edge";

export const metadata: Metadata = {
  title: "Contact Power Soul Fitness | Gym Location in Lonar",
  description: "Find us in Lonar, Maharashtra. Opposite Limbi Lake, Loni Road. Contact us for gym memberships, personal training, and world-class fitness coaching.",
};

export default function ContactPage() {
  return <ContactClient />;
}
