import React from 'react';
import { GetServerSideProps } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useUserAgent } from 'next-useragent';

type Props = {
  searchKeyword: string;
  data: any;
};

const baseURL: string = 'https://www.coupang.com';

function ProductsPage({ searchKeyword, data }: Props) {
  return <div className="container">{data}</div>;
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

  // console.log(context.req.headers['user-agent']);

  const searchId: string = query.q;

  // const response = await axios.get(
  //   // `https://www.coupang.com/np/search?rocketAll=false&q=${searchId}&brand=&offerCondition=&filter=&availableDeliveryFilter=&filterType=&isPriceRange=false&priceRange=&minPrice=&maxPrice=&page=1&trcid=&traid=&filterSetByUser=true&channel=auto&backgroundColor=&searchProductCount=122651&component=&rating=0&sorter=scoreDesc&listSize=36`,
  //   // `https://www.coupang.com/np/search?rocketAll=false&searchId=3bc519c953cc4421b402bafab0788257&q=%EB%8B%AD%EA%B0%80%EC%8A%B4%EC%82%B4&brand=&offerCondition=&filter=&availableDeliveryFilter=&filterType=&isPriceRange=false&priceRange=&minPrice=&maxPrice=&page=1&trcid=&traid=&filterSetByUser=true&channel=user&backgroundColor=&searchProductCount=309109&component=&rating=0&sorter=scoreDesc&listSize=36`,
  //   `https://category.gmarket.co.kr/listview/L100000103.aspx`,
  //   {
  //     headers: {
  //       'Content-Type': 'application/json',
  //       'Accept-Language': 'ko-KR,ko;q=0.8,en-US;q=0.5,en;q=0.3',
  //     },
  //   }
  // );

  // 일반적인 사용 예시
  puppeteer.launch({ headless: true }).then(async (browser: any) => {
    console.log('Running tests..');
    const page = await browser.newPage();
    await page.goto(
      `https://www.coupang.com/np/search?rocketAll=false&q=${searchId}&brand=&offerCondition=&filter=&availableDeliveryFilter=&filterType=&isPriceRange=false&priceRange=&minPrice=&maxPrice=&page=1&trcid=&traid=&filterSetByUser=true&channel=auto&backgroundColor=&searchProductCount=122651&component=&rating=0&sorter=scoreDesc&listSize=36`
    );

    await page.waitForTimeout(5000);
    // await page.screenshot({ path: 'testresult.png', fullPage: true });

    const content = await page.content();
    const $ = cheerio.load(content);
    await browser.close();
    console.log(`All done, check the screenshot. ✨`);

    let ulList: any[] = [];
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
      data: [],
    },
  };
};

export default ProductsPage;
