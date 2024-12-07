import React, { useEffect, useState } from "react";
import { Dots } from "./newDiagnosisPAgeComponents/baseComponents/createNewDiagnosisPopUp";
import { getBaseUrl } from "~/utils/getHost";
import { Icon } from "lucide-react";
import { FaHamburger } from "react-icons/fa";

export const NavMenu: React.FC = () => {
  const [host, setHost] = useState<string | null>(null);
  const [isToggled, setIsToggled] = useState(false);
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
      <button
        onClick={() => setIsToggled(!isToggled)}
        className="flex items-center justify-center w-16 h-10 rounded-full bg-primary hover:bg-primary-dark text-white transition-colors duration-200"
      ><FaHamburger/></button>
    </div>
      {isToggled && <nav className="bg-primary text-white shadow-lg">
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
          </ul>
        </div>
      </nav>}
  </div>
  );
};
