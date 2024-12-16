import React, { useEffect, useState } from "react";
import { Dots } from "./newDiagnosisPAgeComponents/baseComponents/createNewDiagnosisPopUp";
import { getBaseUrl } from "~/utils/getHost";
import { Icon } from "lucide-react";
import { FaHamburger } from "react-icons/fa";

export const NavMenu: React.FC = () => {
  const [host, setHost] = useState<string | null>(null);
  useEffect(() => {
    setHost(getBaseUrl(window.location.href));
  }, []);

  if (host === null) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Dots />
      </div>
    );
  }

    

  return (
  <div>
    <div>

    </div>
      {true && <nav className="bg-primary text-white shadow-lg">
        <div className="container mx-auto p-4">
          <ul className="flex justify-center space-x-6">
            <li>
              <a
                href={`${host}/diagnoses/feed`}
                className="text-primarytext transition-colors duration-200 hover:text-white"
              >
                Feed
              </a>
            </li>
            <li>
              <a
                href={`${host}/diagnoses/new`}
                className="text-primarytext transition-colors duration-200 hover:text-white"
              >
                New Diagnosis
              </a>
            </li>
            <li>
              <a href={`${host}/faq`}>
                FAQ
              </a>
            </li>
          </ul>
        </div>
      </nav>}
  </div>
  );
};
