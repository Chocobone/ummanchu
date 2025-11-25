import React from "react";

type Contact = {
  labNameKo: string;
  labNameEn: string;
  addressKo: string;
};

const DEFAULT_CONTACT: Contact = {
  labNameKo: "음만추",
  labNameEn: "Ummanchu",
  addressKo: "서울시 동작구 상도로",
};

async function getContact(): Promise<Contact> {
  try {
    const res = await fetch("/api/contact", { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch contact");
    const data = (await res.json()) as Partial<Contact>;
    return { ...DEFAULT_CONTACT, ...data };
  } catch {
    return DEFAULT_CONTACT;
  }
}

export default async function Footer() {
  const contact = await getContact();

  return (
    <footer className="bg-[#0f0f0f] text-white py-14 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Title */}
        <h2 className="text-3xl font-bold text-primary mb-8">연락</h2>

        {/* Lab Name */}
        <div className="mb-6">
          <h3 className="text-primary font-semibold">서비스명</h3>
          <p className="text-lg">
            {contact.labNameKo} ({contact.labNameEn})
          </p>
        </div>

        {/* Address */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-primary font-semibold mb-1">주소 (KOR)</h3>
            <p className="whitespace-pre-line text-white/90">{contact.addressKo}</p>
          </div>
        </div>

        <hr className="border-t border-white/20 my-8" />

        <p className="text-sm text-gray-400 text-center">
          © {new Date().getFullYear()} 음만추. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
