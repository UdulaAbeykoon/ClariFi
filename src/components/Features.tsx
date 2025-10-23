import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const cards = [
  {
    number: "01",
    title: "Paris",
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80"
  },
  {
    number: "02",
    title: "Warsaw",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80"
  },
  {
    number: "03",
    title: "Madrid",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80"
  },
  {
    number: "04",
    title: "Tokyo",
    image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80"
  }
];

const Features = () => {
  return (
    <section id="features" className="py-20 bg-gradient-to-b from-background to-gray-950 overflow-visible">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Powerful Features for
            <span className="text-primary"> Focused Learning</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to excel in business studies, designed with modern learning principles.
          </p>
        </div>
      </div>

      <div className="py-20 overflow-visible">
        <Carousel
          opts={{
            align: "center",
            loop: true,
          }}
          className="w-full overflow-visible"
        >
          <CarouselContent className="overflow-visible">
            {cards.map((card, index) => (
              <CarouselItem key={index} className="md:basis-1/3 lg:basis-1/4 overflow-visible">
                <div
                  className="relative h-[400px] w-full rounded-2xl cursor-grab active:cursor-grabbing mx-6"
                  style={{
                    transform: `rotate(${(index % 4) * -8 + 12}deg) translateY(${(index % 4) * 20}px)`,
                  }}
                >
                  <img
                    src={card.image}
                    alt={card.title}
                    className="w-full h-full object-cover rounded-2xl"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent rounded-2xl pointer-events-none" />
                  <div className="absolute top-8 left-8">
                    <h3 className="text-8xl font-serif text-white/90 leading-none">
                      {card.number}
                    </h3>
                  </div>
                  <div className="absolute bottom-8 left-8">
                    <p className="text-4xl font-serif text-white">
                      {card.title}
                    </p>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-4 z-10" />
          <CarouselNext className="right-4 z-10" />
        </Carousel>
      </div>
    </section>
  );
};

export default Features;