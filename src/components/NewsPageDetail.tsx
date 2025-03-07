import { Link, useParams } from "react-router-dom";
import { newsItems } from "../constants/NewsData";
import parse from "html-react-parser"; // Import the parser
export default function NewsPageDetail() {
  const { id } = useParams();
  const newsId = parseInt(id || "0", 10); // Convert id to number
  const data = newsItems.find((item) => item.id === newsId); // Find the news item

  if (!data) {
    return <p className="text-center text-red-500">News item not found!</p>;
  }
  return (
    <div className="lh-detail noto ">
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
      </div>
      <div className="detail-bottom relative">
        <div className="detail-bottom-top">
          <Link to="/news" className="return-page" data-v-ad615414>
            <img src="/img/detail-return.png" alt="icon-top" className="imga" />
          </Link>
          <div className="icon" data-v-ad615414>
            <img src="/img/detail-icon1.png" alt="icon-top" className="imga" />
          </div>
        </div>
        <div className="detail-bottom-title relative l-font24">
          <h1 className="leading-[1.25] m-0">{data.title}</h1>
        </div>
        <div className="detail-bottom-crumbs flex l-font20">
          <div className="left">
            <img src="/img/detail-icon6.png" className="imga star" />
            <Link to="/" data-lilac>
              HOME
            </Link>
            <img src="/img/detail-icon7.png" className="imga jt" />
            <Link to="/news" data-lilac>
              NEWS
            </Link>
          </div>
        </div>
        <div className="right">{data.date}</div>
        <div className="detail-bottom-info relative">
          <div className="detail-ccont relative">
            <div className="info-icon">
              <img src="/img/detail-icon9.png" alt="icon" className="imga" />
              <img src="/img/detail-icon12.png" alt="icon" className="imga" />
            </div>
            <div className="cont l-font18 leading-[1.5]">
              {parse(data.content)}
            </div>
          </div>
        </div>
        <div className="detail-bottom-icon">
          <img src="/img/detail-icon18.jpg" className="imga icon1" />
          <img src="/img/detail-icon15.png" className="imga icon2" />
          <img src="/img/detail-icon14.png" className="imga icon3" />
          <img src="/img/detail-icon13.png" className="imga icon4" />
          <img src="/img/detail-icon16.png" className="imga icon5" />
          <img src="/img/detail-icon17.png" className="imga icon6" />
        </div>
      </div>
    </div>
  );
}
