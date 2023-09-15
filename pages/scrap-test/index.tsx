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
  content: string;
};

const baseURL: string = 'https://www.coupang.com';

function ScrapAxios({ searchKeyword, data, content }: Props) {
  return (
    <>
      {data &&
        data.map((item: any, idx: any) => {
          return (
            <div className="container" key={idx}>
              {item.title}
            </div>
          );
        })}

      <div>
        <span>{content}</span>
      </div>
    </>
  );
}

const axios = require('axios');
const cheerio = require('cheerio');

export const getServerSideProps: GetServerSideProps = async (context: any) => {
  const { query } = context;

  const searchId: string = query.q;

  const response = await axios.get(
    `https://pages.coupang.com/p/54908`, //반품마켓
    // `https://www.cgv.co.kr`,
    {
      headers: {
        'Content-Type': 'application/json',
        'Accept-Language': 'ko-KR,ko;q=0.8,en-US;q=0.5,en;q=0.3',
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36',
      },
    }
  );

  const content = await response.data;

  // const $ = cheerio.load(content);

  // let ulList: any[] = [];
  // const bodyList: any[] = $('#productList>li');
  // bodyList.map((i, el) => {
  //   ulList[i] = {
  //     no: i,
  //     title: $(el).find('.descriptions .name').text(),
  //     image: $(el).find('.image .search-product-wrap-img').attr('data-img-src')
  //       ? $(el).find('.image .search-product-wrap-img').attr('data-img-src')
  //       : $(el).find('.image .search-product-wrap-img').attr('src'),
  //     link: $(el).find('.search-product-link').attr('href'),
  //   };
  // });

  return {
    props: {
      searchKeyword: searchId,
      data: [],
      content,
    },
  };
};

export default ScrapAxios;
