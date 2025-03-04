import Lenis from "lenis";
import { newsItems } from "../constants/NewsData";
import { Link } from "react-router";

interface NewsPageProps {
  lenis: Lenis | null;
}

export default function NewsPage({ lenis }: NewsPageProps) {
  const scrollToTop = () => {
    if (lenis) {
      lenis.scrollTo(0, {
        duration: 1.2,
        easing: (t: number) => 1 - Math.pow(1 - t, 3),
      });
    }
  };
  return (
    <main>
      <div className="detail-top relative">
        <img
          src="/img/detail-top.jpg"
          alt="detail-top"
          className="w-full imga"
        />
        <div className="title ">
          <img
            src="https://onestop.63cj.com/locRes?id=News_Ti&lang=en&name=afk2"
            alt="title-top"
            className="w-full imga"
          />
        </div>
        <div className="icon" data-v-ad615414>
          <img src="/img/detail-icon1.png" alt="icon-top" className="imga" />
        </div>
      </div>
      <div className="content noto" data-v-ad615414>
        <div
          className="list flex flex-col gap-[1.5625vw] pb-[4.2708vw] relative items-center"
          data-v-ad615414
        >
          <Link to="/" className="go_back" data-v-ad615414>
            <img src="/img/detail-return.png" alt="icon-top" className="imga" />
          </Link>
          <div
            className="go_top fixed right-[1.0938vw] width-[3.2813vw] cursor-pointer"
            data-v-ad615414
            onClick={scrollToTop}
          >
            <img src="/img/nl13.png" alt="icon-top" className="imga" />
          </div>
          {/* //content */}
          {/* Render News Items */}
          {newsItems.map((item, index) => (
            <a href={item.link} className="item" key={index} data-v-ad615414>
              <div className="info" data-v-ad615414>
                <div className="title_r" data-v-ad615414>
                  <i className="icon transition" data-v-ad615414></i>
                  <div
                    className="title transition l-font42 leading-[1.25]"
                    data-v-ad615414
                  >
                    {item.title}
                  </div>
                </div>
                <div className="line" data-v-ad615414>
                  <img
                    src={item.iconImage}
                    alt="icon-top"
                    className="imga"
                    data-v-ad615414
                  />
                </div>
                <div className="desc l-font18 leading-[1.5]" data-v-ad615414>
                  {item.description}
                </div>
                <div className="date" data-v-ad615414>
                  {item.date}
                </div>
              </div>
              <div className="img" data-v-ad615414>
                <img
                  src={item.mainImage}
                  className="imga"
                  alt="img"
                  data-v-ad615414
                />
                <img
                  src={item.outImage}
                  alt="outimg"
                  className="outimg"
                  data-v-ad615414
                />
              </div>
            </a>
          ))}
        </div>
      </div>
    </main>
  );
}
