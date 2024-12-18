import BentoCard from "./BentoCard";

export default function Features() {
  return (
    <section className="bg-black pb-52">
      <div className="container mx-auto px-3 md:px-10">
        <div className="px-5 py-32">
          <p className="font-circular-web text-lg text-blue-50">
            Into the MetaGame Layer
          </p>

          <p className="max-w-md font-circular-web text-lg text-blue-50 opacity-50">
            djasoidjaiodjioasjdioajdioajsidjaiosdjaiodjioasjdioasjdioajsdioajsidajidjasiodjaiosjdioajdsioasjdioajdioasjdiasjdsai
          </p>
        </div>

        <div className="border-hsla relative mb-7 h-96 w-full overflow-hidden rounded-md md:h-[65vh]">
          <BentoCard
            src="videos/feature-1.mp4"
            title={
              <>
                radi<b>n</b>t
              </>
            }
            description="adshiodhoiashfioahfiuahfioahfio has oidashd ioasdioash doiahsdais"
            isComingSoon
          />
        </div>
        <div className="grid h-[135vh] grid-cols-2 grid-rows-3 gap-7">
          <div className="bento-tilt_1 row-span-1 md:col-span-1 md:row-span-2">
            <BentoCard
              src="videos/feature-2.mp4"
              title={
                <>
                  Zig<b>m</b>a
                </>
              }
              description="aiosdj ioajdio ajsdio jasiodja iosdjasidj asiodj aiosjd ioasds"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
