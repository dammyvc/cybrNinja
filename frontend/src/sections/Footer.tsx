"use client";

import React, { useState } from "react";

export const Footer = () => {
  const [modalContent, setModalContent] = useState<string | null>(null);

  const openModal = (content: string) => {
    setModalContent(content);
  };

  const closeModal = () => {
    setModalContent(null);
  };

  return (
    <>
      <footer className="h-10 flex justify-center items-center">
        CyberDojang © 2025 |&nbsp;
        <button onClick={() => openModal("privacy")} className="underline">Privacy Policy</button>&nbsp;|
        &nbsp;<button onClick={() => openModal("terms")} className="underline">Terms & Conditions</button>&nbsp;|
        &nbsp;<button onClick={() => openModal("cookie")} className="underline">Cookie Policy</button>&nbsp;
      </footer>
      
      {/* Modal */}
      {modalContent && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-dark p-6 rounded-lg w-96 relative">
            <button onClick={closeModal} className="absolute top-2 right-2 text-xl">&times;</button>
            <h2 className="text-lg font-bold mb-4">
              {modalContent === "privacy" && "Privacy Policy"}
              {modalContent === "terms" && "Terms & Conditions"}
              {modalContent === "cookie" && "Cookie Policy"}
            </h2>
            <p className="text-sm">
              {modalContent === "privacy" &&
                "Your privacy is important to us. This policy outlines how we collect, use, and protect your information. " +
                "We collect only necessary data, such as your username, email, and quiz activity. Your information is used to improve your learning experience and maintain security. " +
                "We do not sell or share your data with third parties. Authentication is handled securely via Auth0. " +
                "We use cookies to enhance user experience, and you can manage cookie preferences in your browser settings."
              }
              {modalContent === "terms" && 
                "By using cybrNinja, you agree to the following terms: " +
                "You must use cybrNinja only for lawful purposes and agree not to misuse the platform. " +
                "You are responsible for maintaining the security of your account credentials. " +
                "All content, including quizzes and AI-generated materials, belong to cybrNinja and cannot be copied or distributed without permission. " +
                "cybrNinja is provided 'as is.' We are not responsible for any loss or damage resulting from its use. " +
                "We may update these terms, and continued use of the service implies acceptance of any changes."
              }
              {modalContent === "cookie" && "CybrNinja uses cookies to maintain user sessions. By continuing to use our website, you agree to our use of cookies for these purposes."}
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default Footer;

