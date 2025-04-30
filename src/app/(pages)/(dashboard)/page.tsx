import React from 'react';
import SalesProfit from '../../components/dashboard/SalesProfit';
import TotalFollowers from '../../components/dashboard/TotalFollowers';
import TotalIncome from '../../components/dashboard/TotalIncome';
import PopularProducts from '../../components/dashboard/PopularProducts';
import EarningReports from '../../components/dashboard/EarningReports';

// Temporarily commenting out metadata-related code
// export const metadata = { ... }; // No metadata block found in this file
// export async function generateMetadata(...) { ... } // No generateMetadata function found in this file
// No imports related to metadata generation were found.

const page = () => {
  return (
    <>
      <div className="grid grid-cols-12 gap-30">
        <div className="lg:col-span-8 col-span-12">
          <SalesProfit/>
        </div>
        <div className="lg:col-span-4 col-span-12">
          <div className="grid grid-cols-12 ">
            <div className="col-span-12 mb-30">
              <TotalFollowers/>
            </div>
            <div className="col-span-12">
              <TotalIncome/>
            </div>
          </div>
        </div>
        <div className="lg:col-span-8 col-span-12">
          <PopularProducts/>
        </div>
        <div className="lg:col-span-4 col-span-12">
          <EarningReports/>
        </div>
      </div>
    </>
  );
};

export default page;
