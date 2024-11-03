import { findTeam, getImageURL } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

export const Footer = () => {
  return (
    <footer className="bg-gray-800 py-6 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 justify-center flex">
        <p className="mr-1">
          Hecho por{" "}
          <Link
            href="https://tomas-mercado.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold hover:underline"
          >
            Tom
          </Link>
          , hincha del capo del sur
        </p>
        <Image
          src={getImageURL(findTeam("Quilmes").imageSrc)}
          alt="Quilmes"
          width={24}
          height={24}
        />
      </div>
    </footer>
  );
};
