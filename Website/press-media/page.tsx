import Hero from "./components/Hero";
import PressRoomSnapshot from "./components/PressRoomSnapshot";
import LatestAnnouncements from "./components/LatestAnnouncements";
import MediaKitAssets from "./components/MediaKitAssets";
import MediaInquiryForm from "./components/MediaInquiryForm";

export const metadata = {
  title: "Press & Media | ZoikoNex",
  description:
    "Official newsroom for ZoikoNex — announcements, media kit, press releases, and media inquiry contact.",
};

export default function PressMediaPage() {
  return (
    <>
      <Hero />
      <PressRoomSnapshot />
      <LatestAnnouncements />
      <MediaKitAssets />
      <MediaInquiryForm />
    </>
  );
}
