import Image from "next/image";
import Hero from "./components/Hero";
import ExtendedHero from "./components/ExtendedHero";
import ApolloFAQ from "./ApolloFAQ/page";
import ApolloTestimonials from "./ApolloTestimonials/page";

export default function Home() {
  return (
    <div>


 <Hero/>
 <ExtendedHero/>
<ApolloFAQ/>
<ApolloTestimonials/>


    </div>
  );
}
