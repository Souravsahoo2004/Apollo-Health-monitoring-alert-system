import Image from "next/image";
import Hero from "./Frontend/components/Hero";
import ExtendedHero from "./Frontend/components/ExtendedHero";
import ApolloFAQ from "./Frontend/ApolloFAQ/page";
import ApolloTestimonials from "./Frontend/ApolloTestimonials/page";

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
