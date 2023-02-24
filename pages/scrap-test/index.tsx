import React from 'react';
import { GetServerSideProps } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Head from 'next/head';
import { useRouter } from 'next/router';

type Props = {
  searchKeyword: string;
  data: any;
};

const baseURL: string = 'https://www.coupang.com';

function ProductsPage({ searchKeyword, data }: Props) {
  return <div className="container px-32">{data}</div>;
}

const axios = require('axios');

export const getServerSideProps: GetServerSideProps = async (context: any) => {
  const { query } = context;

  const searchId: string = query.q;

  const response = await axios.get(
    // `https://www.coupang.com/np/search?rocketAll=false&q=${searchId}&brand=&offerCondition=&filter=&availableDeliveryFilter=&filterType=&isPriceRange=false&priceRange=&minPrice=&maxPrice=&page=1&trcid=&traid=&filterSetByUser=true&channel=auto&backgroundColor=&searchProductCount=122651&component=&rating=0&sorter=scoreDesc&listSize=36`,
    `https://www.amazon.com/s?i=fashion-womens-intl-ship&bbn=16225018011&rh=n%3A16225018011%2Cn%3A1040660%2Cn%3A1045024&pd_rd_r=d62aaf83-f01d-40be-82b8-8df79e9d0e26&pd_rd_w=yN5zz&pd_rd_wg=hlhRA&pf_rd_p=6a92dcea-e071-4bb9-866a-369bc067390d&pf_rd_r=RQZ6H33XKHBDWZ62MTK7&qid=1646786470&rnid=1040660&ref=pd_gw_unk`,
    {
      headers: {
        'Content-Type': 'application/json',
        'Accept-Language': 'ko-KR,ko;q=0.8,en-US;q=0.5,en;q=0.3',
      },
    }
  );

  return {
    props: {
      searchKeyword: searchId,
      data: response.data,
    },
  };
};

export default ProductsPage;
