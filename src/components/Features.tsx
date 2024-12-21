import BentoCard from "./BentoCard";
import BentoTilt from "./BentoTilt";

export default function Features() {
  return (
    <section className="pb-52">
      <div className="container mx-auto px-3 md:px-10">
        <div className="px-5 py-32">
          <p className="font-circular-web text-lg text-blue-50">
            Met The Characters
          </p>

          <p className="max-w-md font-circular-web text-lg text-blue-50 opacity-50">
            Explore the journeys of unique characters as their fates intertwine
            with the world around them, filled with mystery, danger, and hope.
          </p>
        </div>

        <BentoTilt className="border-hsla relative mb-7 h-96 w-full overflow-hidden rounded-md md:h-[65vh]  ">
          <BentoCard
            src="videos/feature1-1.mp4"
            title={<>Sonja</>}
            description="From above Rustport, Sonja watches her domain - ships in the harbor, travelers, children at play, gang thugs on the prowl - and sees her own fate reflected in their lives."
            isComingSoon
          />
        </BentoTilt>
        <div className="grid h-[135vh] grid-cols-2 grid-rows-3 gap-7">
          <BentoTilt className="bento-tilt_1 row-span-1 md:col-span-1 md:row-span-2 border-hsla">
            <BentoCard
              src="videos/feature1-2.mp4"
              title={<>Hugin</>}
              description="Master blacksmith haunted by a tragic past, he seeks vengeance against those who wronged him, hoping his creations will bring justice"
            />
          </BentoTilt>
          <BentoTilt className="bento-tilt_1 row-span-1 ms-32 md:col-span-1 md:ms-0 border-hsla">
            <BentoCard
              src="videos/feature1-3.mp4"
              title={<>Lily May</>}
              description="The Twilight Tracker"
            />
          </BentoTilt>
          <BentoTilt className="bento-tilt_1 me-14 md:col-span-1 md:me-0 border-hsla">
            <BentoCard
              src="videos/feature1-4.mp4"
              title={
                <>
                  V<b>a</b>la
                </>
              }
              description="Phantom of Oakenfell"
            />
          </BentoTilt>
          <BentoTilt className="bento-tilt_2 border-hsla ">
            <div className="flex size-full overflow-hidden relative">
              <img
                src="videos/feature1-6.jpg"
                className="object-cover object-center"
              />
              <h1 className="absolute top-5 left-5 z-10 bento-title special-font text-blue-50">
                More <br /> Coming <br /> Soon
              </h1>
            </div>
          </BentoTilt>
          <BentoTilt className="bento-tilt_2 border-hsla">
            <video
              src="videos/feature1-5.mp4"
              loop
              muted
              autoPlay
              className="size-full object-cover object-center  "
            />
          </BentoTilt>
        </div>
      </div>
    </section>
  );
}
