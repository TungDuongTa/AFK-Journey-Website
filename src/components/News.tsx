import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import { Link } from "react-router";
import { newsItems } from "../constants/NewsData";
gsap.registerPlugin(ScrollTrigger);
export default function News() {
  const titleRef = useRef<HTMLDivElement>(null);
  const newsRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);
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
    gsap.to(iconRef.current, {
      x: "0%", // Horizontal translation
      y: "0%", // Vertical translation
      scrollTrigger: {
        trigger: newsRef.current,
        start: "top bottom", // Start animation when top of #News hits the bottom of the viewport
        end: "bottom top", // End animation when top of #News hits the top of the viewport
        scrub: true, // Smoothly interpolate the animation as you scroll
        toggleActions: "play none none reverse", // Allows replay on reverse
      },
    });
  }, []);
  return (
    <div id="News" className="index-news relative" ref={newsRef}>
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
              ref={iconRef}
              className="icon current"
              style={{
                translate: "none",
                rotate: "none",
                scale: "none",
                transform: "translate(50%, 0%) translate3d(0px, 0px, 0px)",
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
              {newsItems.slice(0, 4).map((item, index) => (
                <li key={index}>
                  <Link to={`/news/${item.id}`} className="cursor-pointer">
                    <div className="left">
                      <i></i>
                      <span className="line-clamp-1 lines">{item.title}</span>
                    </div>
                    <div className="right">{item.date}</div>
                  </Link>
                </li>
              ))}
            </ul>
            <div
              className=" w-full flex justify-end"
              style={{ paddingRight: "var(--size-40)" }}
            >
              <Link to="/news" className="cursor-pointer">
                <img
                  src="img/more-news.png"
                  className="imga"
                  style={{ width: "calc(var(--size-130) * 2)" }}
                />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
