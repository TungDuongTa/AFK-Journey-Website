import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import { newsItems } from "../constants/NewsData";
import { Link } from "react-router";
gsap.registerPlugin(ScrollTrigger);
export default function NewsMobile() {
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
      {/* title div */}
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
      <div className="news-cont relative flex flex-wrap">
        <div className="news-banner l-banner overflow-hidden ">
          <div className="img">
            <img src="/img/news-img.jpg" className="imga" />
          </div>
        </div>

        <div className="news-bottom">
          <div className="icon current">
            <img src="/img/icon3.png" className="imga inline-block w-full" />
          </div>

          <div className="title flex flex-wrap l-font20 ">
            <span>
              <i>LATEST</i>
            </span>
          </div>
          <ul className="news-item l-font16 list-none ">
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
          <Link
            to="/news"
            className="cursor-pointer w-full flex justify-end"
            style={{ paddingRight: "var(--size-40)" }}
          >
            <img
              src="img/more-news.png"
              className="imga"
              style={{ width: "calc(var(--size-130) * 2)" }}
            />
          </Link>
        </div>
      </div>
    </div>
  );
}
