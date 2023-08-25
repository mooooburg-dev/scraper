import { GetServerSideProps } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Head from 'next/head';
import { useRouter } from 'next/router';

type Props = {
  searchKeyword: string;
  products: any[];
};

const baseURL: string = 'https://www.coupang.com';

export default function ProductsPage({ searchKeyword, products }: Props) {
  return (
    <div className="container px-32">
      <Head>
        <title>{`현재 쿠팡에서 제일 잘 팔리고 있는 ${searchKeyword}`}</title>
        <meta
          name="description"
          content={`현재 쿠팡에서 제일 잘 팔리고 있는 ${searchKeyword}`}
        />
      </Head>
      <div className="pt-14">
        <h1 className="mb-4 font-extrabold">
          {`현재 쿠팡에서 제일 잘 팔리고 있는 "${searchKeyword}"`}
        </h1>
      </div>
      {products &&
        products.map((product, index) => (
          <div key={index} className="mb-4 flex">
            <Link href={`${baseURL}${product.link}`} className="mb-4 flex">
              <Image
                src={`https:${product.image}`}
                alt={product.title}
                width={260}
                height={260}
                priority
              />
              <div className="m-4">{product.title}</div>
            </Link>
          </div>
        ))}
    </div>
  );
}

const axios = require('axios');
const cheerio = require('cheerio');
// puppeteer-extra 는 puppeteer의 모든 기능을 가지고 있습니다.
// plugin과의 호환을 위해 puppeteer 대신 puppeteer-extra를 사용해주세요.
const puppeteer = require('puppeteer-extra');

// 플러그인을 puppeteer의 기본값으로 넣어주세요.
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

export const getServerSideProps: GetServerSideProps = async (context: any) => {
  const { query } = context;
  puppeteer.use(StealthPlugin());

  const searchId: string = query.q;

  let ulList: any[] = [];

  // const response = await axios.get(
  //   `https://www.coupang.com/np/search?rocketAll=false&q=${searchId}&brand=&offerCondition=&filter=&availableDeliveryFilter=&filterType=&isPriceRange=false&priceRange=&minPrice=&maxPrice=&page=1&trcid=&traid=&filterSetByUser=true&channel=auto&backgroundColor=&searchProductCount=122651&component=&rating=0&sorter=scoreDesc&listSize=36`,
  //   {
  //     headers: {
  //       'Content-Type': 'application/json',
  //       'Accept-Language': 'ko-KR,ko;q=0.8,en-US;q=0.5,en;q=0.3',
  //     },
  //   }
  // );

  // 일반적인 사용 예시
  const browserFetcher = puppeteer.createBrowserFetcher();
  let revisionInfo = await browserFetcher.download('1095492');

  console.log(revisionInfo.executablePath);
  const browser = await puppeteer
    .launch({
      executablePath: revisionInfo.executablePath,
      ignoreDefaultArgs: ['--disable-extensions'],
      headless: true,
      args: ['--no-sandbox', '--disabled-setupid-sandbox'],
    })
    .then(async (browser: any) => {
      //   console.log('Running tests..');
      const page = await browser.newPage();
      await page.goto(`https://www.coupang.com/np/search?q=${searchId}`);
      // await page.goto('https://www.coupang.com/np/categories/186764');
      await page.waitForTimeout(5000);
      //   // await page.screenshot({ path: 'testresult.png', fullPage: true });
      const content = await page.content();
      const $ = cheerio.load(content);
      // console.log(content);
      await browser.close();
      console.log(`All done, check the screenshot. ✨`);
      const bodyList: any[] = $('#productList>li');
      bodyList.map((i, el) => {
        ulList[i] = {
          no: i,
          title: $(el).find('.descriptions .name').text(),
          image: $(el)
            .find('.image .search-product-wrap-img')
            .attr('data-img-src')
            ? $(el).find('.image .search-product-wrap-img').attr('data-img-src')
            : $(el).find('.image .search-product-wrap-img').attr('src'),
          link: $(el).find('.search-product-link').attr('href'),
        };
      });
      console.log(ulList);
    });

  return {
    props: {
      searchKeyword: searchId,
      products: ulList,
    },
  };
};
