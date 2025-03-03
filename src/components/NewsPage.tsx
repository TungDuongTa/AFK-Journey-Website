export default function NewsPage() {
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
          <a href="/" className="go_back" data-v-ad615414>
            <img src="/img/detail-return.png" alt="icon-top" className="imga" />
          </a>
          <div
            className="go_top fixed right-[1.0938vw] width-[3.2813vw]"
            data-v-ad615414
          >
            <img src="/img/nl13.png" alt="icon-top" className="imga" />
          </div>
          {/* //content */}
          <a href="/" className="item" data-v-ad615414>
            <div className="info" data-v-ad615414>
              <div className="title_r" data-v-ad615414>
                <i className="icon transition" data-v-ad615414></i>
                <div
                  className="title transition l-font42 leading-[1.25] "
                  data-v-ad615414
                >
                  AFK Journey 1.3.2 Patch Notes
                </div>
              </div>
              <div className="line" data-v-ad615414>
                <img src="/img/nl11.png" alt="icon-top" className="imga" />
              </div>
              <div className="desc  l-font18 leading-[1.5]" data-v-ad615414>
                In order to improve your game experience, the server will
                undergo maintenance on February 20 from 02:30 to 03:30 UTC to
                update to Version 1.3.2. You will not be able to log in during
                this time. For the safety of your account data, please exit the
                game before the maintenance begins. We apologize for any
                inconvenience this may cause.
              </div>
              <div className="date" data-v-ad615414>
                02/19/2025
              </div>
            </div>
            <div className="img" data-v-ad615414>
              <img
                src="https://ad-gw-i2404029.farlightgames.com/assets/a8bca1fb-0237-4d1e-9b12-7b2665b2a9a0?width=452"
                className="imga"
                alt="img"
                data-v-ad615414
              />
              <img
                src="/img/nl22.png"
                alt="outimg"
                className="outimg"
                data-v-ad615414
              />
            </div>
          </a>
        </div>
      </div>
    </main>
  );
}
