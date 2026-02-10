"use client";

import Breadcrumbs from "./Breadcrumbs";
import FiltersBar from "./FilterBar";
import ResultsHeader from "./ResultsHeader";
import PropertyList from "./PropertyList";

export default function SearchResultsPanel() {
  return (
    <section className="w-full  flex flex-col  bg-transparent border-r border-slate-200 ">

      <div className="flex flex-col border-b border-slate-200 bg-white ">

        <Breadcrumbs />
        <FiltersBar />
        <ResultsHeader />

      </div>

    </section>
  );
}
