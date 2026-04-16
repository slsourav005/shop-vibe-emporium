import { motion } from "framer-motion";
import heroBanner from "@/assets/hero-banner.jpg";

const HeroBanner = () => (
  <section className="relative h-64 overflow-hidden sm:h-80 md:h-96">
    <img
      src={heroBanner}
      alt="Vyapar Vaani - Rural Indian Marketplace"
      className="h-full w-full object-cover"
      width={1920}
      height={640}
    />
    <div className="absolute inset-0 bg-gradient-to-r from-foreground/70 via-foreground/40 to-transparent" />
    <div className="absolute inset-0 flex items-center">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <h1 className="max-w-lg text-3xl font-bold text-card sm:text-4xl md:text-5xl">
            Discover Rural India's Finest
          </h1>
          <p className="mt-2 max-w-md text-sm text-card/80 sm:text-base">
            Authentic handcrafted goods, organic produce & artisanal treasures — directly from villages to your doorstep.
          </p>
        </motion.div>
      </div>
    </div>
  </section>
);

export default HeroBanner;
