import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";
gsap.registerPlugin(ScrollTrigger);
export default function News() {
  const newsItems = [
    { title: "Winter Carnival: History and Traditions", date: "12/23/2024" },
    {
      title:
        "1.2.4 Patch Update: Winter Carnival, New Quest,Combat Crucible, More",
      date: "12/19/2024",
    },
    { title: "Hugin - Maverick Smith | Journey Unfolds", date: "12/18/2024" },
    { title: "AFK Journey 1.2.4 Patch Notes", date: "12/18/2024" },
  ];
  const titleRef = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    // Set up GSAP animation
    gsap.to(titleRef.current, {
      x: "0%", // Horizontal translation
      y: "0%", // Vertical translation
      scale: 1, // No scaling
      rotation: 0, // No rotation
      opacity: 1, // Fully visible
      scrollTrigger: {
        trigger: titleRef.current,
        start: "top bottom", // Top of the .ref meets the bottom of the viewport
        toggleActions: "play none none reverse", // Allows replay on reverse
      },
    });
  }, []);
  return (
    <div id="News" className="index-news relative">
      <div className="news-icon1 current">
        <img src="/img/icon6.jpg" className="imga" />
      </div>
      <div className="l-container">
        <div
          className="lh-title news "
          ref={titleRef}
          style={{
            opacity: 0,
            translate: "none",
            scale: "none",
            rotate: "none",
            transform: "translate(0%, 50%)",
          }}
        >
          <img src="/img/title05.png" className="imga" />
        </div>
        <div className="news-cont relative flex">
          <div className="left">
            <div className="news-banner l-banner overflow-hidden ">
              <div className="img">
                <img src="/img/news-img.jpg" className="imga" />
              </div>
            </div>
          </div>
          <div className="right">
            <div
              className="icon current"
              style={{
                translate: "none",
                rotate: "none",
                scale: "none",
                transform: "translate(14.4118%, 0%) translate3d(0px, 0px, 0px)",
              }}
            >
              <img src="/img/icon3.png" className="imga" />
            </div>
            <div className="title flex flex-wrap l-font20 ">
              <span>
                <i>LATEST</i>
              </span>
            </div>
            <ul className="news-item l-font16 ">
              {newsItems.map((item, index) => (
                <li key={index}>
                  <a target="_blank" className="cursor-pointer">
                    <div className="left">
                      <i></i>
                      <span className="line-clamp-1 lines">{item.title}</span>
                    </div>
                    <div className="right">{item.date}</div>
                  </a>
                </li>
              ))}
            </ul>
            <a
              target="_blank"
              className="cursor-pointer w-full flex justify-end"
              style={{ paddingRight: "var(--size-40)" }}
            >
              <img
                src="img/more-news.png"
                className="imga"
                style={{ width: "calc(var(--size-130) * 2)" }}
              />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
