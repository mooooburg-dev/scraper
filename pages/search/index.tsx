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

export const getServerSideProps: GetServerSideProps = async (context: any) => {
  const { query } = context;

  const cheerio = require('cheerio');
  // puppeteer-extra 는 puppeteer의 모든 기능을 가지고 있습니다.
  // plugin과의 호환을 위해 puppeteer 대신 puppeteer-extra를 사용해주세요.
  let puppeteer: any;
  let chrome: any;
  let isVercel: boolean = false;

  console.log(
    `process.env.AWS_LAMBDA_FUNCTION_VERSION: ${process.env.AWS_LAMBDA_FUNCTION_VERSION}`
  );
  if (process.env.AWS_LAMBDA_FUNCTION_VERSION) {
    console.log('[VERCEL mooburg]');
    isVercel = true;
    chrome = require('chrome-aws-lambda');
    puppeteer = require('puppeteer-core');
  } else {
    console.log('[!VERCEL mooburg]');
    isVercel = false;
    puppeteer = require('puppeteer-extra');
  }

  // 플러그인을 puppeteer의 기본값으로 넣어주세요.
  const StealthPlugin = require('puppeteer-extra-plugin-stealth');
  if (!isVercel) puppeteer.use(StealthPlugin());

  const searchId: string = query.q;

  let ulList: any[] = [];

  // 일반적인 사용 예시
  let revisionInfo;
  if (!isVercel) {
    const browserFetcher = puppeteer.createBrowserFetcher();
    revisionInfo = await browserFetcher.download('1095492');
  } else {
    // revisionInfo = await chrome.executablePath;
    revisionInfo = '/path/to/chromium-binary';
    console.log(`revisionInfo: ${revisionInfo}`);
  }

  const browser = await puppeteer
    .launch({
      executablePath: isVercel ? 'revisionInfo' : revisionInfo.executablePath,
      ignoreDefaultArgs: ['--disable-extensions'],
      headless: true,
      ignoreHTTPSErrors: true,
      args: [
        '--no-sandbox',
        '--disabled-setupid-sandbox',
        '--disable-web-security',
      ],
    })
    .then(async (browser: any) => {
      const page = await browser.newPage();
      await page.goto(`https://www.coupang.com/np/search?q=${searchId}`);
      // await page.goto(`https://pages.coupang.com/p/96636`);
      // await page.goto('https://www.coupang.com/np/categories/186764');
      await page.waitForTimeout(5000);
      const content = await page.content();
      const $ = cheerio.load(content);
      // console.log(content);
      await browser.close();
      // console.log(`All done, check the screenshot. ✨`);
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
    });

  return {
    props: {
      searchKeyword: searchId,
      products: ulList,
    },
  };
};
