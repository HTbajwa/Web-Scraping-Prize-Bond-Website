import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import * as XLSX from "xlsx";
import { utils } from "xlsx";
const BondCheck = () => {
    const [indexData, setIndexData] = useState({});
      const [BondType, setBondType] = useState("");
      const [BondYear, setBondYear] = useState("");
      const [BondDate, setBondDate] = useState("");
      const [Result, setResult] = useState(null);
    
      // **********************************Indexing files and their names*********************************
      useEffect(() => {
        async function prizeBondData() {
          try {
            const Allfiles = await fetch("/prizeBonds/index.json");
            const index = await Allfiles.json();
            setIndexData(index);
            console.log(indexData);
          } catch (err) {
            console.error("Error loading data:", err);
          }
        }
        prizeBondData();
      }, []);
    
      // <!"********************************For SHEETJS/XLSX**********************************************"!>
      const [sheetData, setsheetData] = useState(null);
    
      const fileLoaded = (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
            const arrayBuffer = e.target.result;
            console.log("Array buffer:", arrayBuffer);
            try {
              const workbook = XLSX.read(arrayBuffer, { type: "array" });
              const singleSheetName = workbook.SheetNames;
              const singleSheet = workbook.Sheets[singleSheetName[0]];
              const data = utils.sheet_to_json(singleSheet);
              setsheetData(data);
            } catch (error) {
              console.log("Sheet Error:", error.message);
            }
          };
          reader.readAsArrayBuffer(file);
        }
      };
    
      // *************************************BUTTON CLICK RESULT**********************************************
      const [match, setmatch] = useState("");
      const handleSubmit = async () => {
        if (!BondType || !BondYear || !BondDate) {
          console.log("Please Select the year date and bondType");
        }
        try {
          const fetchResult = await fetch(
            `/prizeBonds/${BondType}/${BondYear}/${BondDate}`
          );
          const parse = await fetchResult.json();
          setResult(parse);
    
          const format = parse?.formatted;
    
          const firstpriz = format?.firstPrize;
          const secondpriz = format?.secondPrizes || [];
          const thirdpriz = format?.otherBondNumbers || [];
          const SheetNumber = sheetData
            .flatMap((row) => Object.values(row))
            .map((str) => String(str).trim())
            .filter((numeric) => /^\d+$/.test(numeric));
          const match = SheetNumber.map((num) => {
            if (num == firstpriz) return { num, result: "Congrats First prize" };
            else if (secondpriz.includes(num))
              return { num, result: "Congrats Second prize" };
            else if (thirdpriz.includes(num))
              return { num, result: "Congrats Third prize" };
            else {
              return { num, result: "Better Luck" };
            }
          });
    
          setmatch(match);
          console.log(Result);
        } catch (error) {
          console.log("Main data extract error:", error);
        }
      };
  return (
    <main className="p-2">
      <section>
        <div className="w-full flex m-4 ">
          <h1 className="bg-red-600 md:w-1/5 rounded-md font-semibold  w-1/2 text-center text-xl">
            Attention
          </h1>
          <marquee className="text-xl italic">
            This is for testing purpose!
          </marquee>
        </div>
        <div className="md:text-6xl text-4xl p-2 text-center font-bold  w-full ">
          SCRAPPING WEB PROJECT
        </div>
        
        <div className="flex flex-col gap-2 items-center justify-center p-10  m-4">
          <label htmlFor="" className="text-2xl">
            Input Prize Bond Number:
          </label>
          <input
            onChange={fileLoaded}
            id="input"
            className="outline outline-white rounded-md px-4 py-2 cursor-pointer mr-0"
            type="file"
            placeholder="Enter your Number"
          />

          <div className="flex flex-col md:flex-row gap-2">
            <br />
            <select
              name=""
              id=""
              className="bg-cyan-950 p-2 rounded-md text-xl cursor-pointer"
              value={BondType}
              onChange={(e) => {
                setBondDate("");
                setBondYear("");
                setBondType(e.target.value);
              }}
            >
              <option value="">All Prize Bonds</option>
              {Object.keys(indexData).map((type) => (
                <option key={type} value={type}>
                  💸{type}
                </option>
              ))}
            </select>

            {BondType && (
              <select
                name=""
                id=""
                className="bg-cyan-950 p-2 rounded-md text-xl cursor-pointer"
                value={BondYear}
                onChange={(e) => {
                  setBondYear(e.target.value);
                  setBondDate("");
                }}
              >
                <option value="">All Years</option>
                {Object.keys(indexData[BondType] || {}).map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            )}

            {BondYear && (
              <select
                name=""
                id=""
                className="bg-cyan-950 p-2 rounded-md text-xl cursor-pointer"
                value={BondDate}
                onChange={(e) => setBondDate(e.target.value)}
              >
                <option value="">Dates</option>
                {(indexData[BondType]?.[BondYear] || {}).map((type) => (
                  <option key={type} value={type}>
                    {type.slice(0, -5)}
                  </option>
                ))}
              </select>
            )}
          </div>

          <button
            type="submit"
            className="bg-cyan-300 p-2 px-8 text-md cursor-pointer hover:bg-cyan-400 transition   rounded-md text-black font-semibold"
            onClick={handleSubmit}
          >
            Submit
          </button>
           <Link className='bg-gray-700 p-1 rounded-md hover:bg-gray-800 transition ease-in-out ' to={"/newfile1"}>Recent File</Link>
         
        </div>
        {match && (
          <div className="flex lg:flex-row flex-col  items-center justify-center bg-white rounded-md  text-cyan-700 font-semibold text-center text-2xl mx-8 -mt-10 lg:mx-32">
            <img className="" src="/annoucement.png" alt="" />
            <div className="flex flex-col">
              <div className="flex flex-col md:flex-row">
                {Result?.formatted?.drawNumber != "Unknown" && (
                  <h5>
                    <span className="text-black">DrawNo:</span>{" "}
                    {Result?.formatted?.drawNumber}
                  </h5>
                )}
                {Result?.formatted?.drawCity != "Unknown" && (
                  <h5>
                    <span className="text-black">Draw City:</span>{" "}
                <span className="text-xl">    {Result?.formatted?.drawCity}</span>
                  </h5>
                )}
                {Result?.formatted?.firstPrizeAmount != "Unknown" && (
                  <h5>
                    <span className="text-black">1st Prize:</span>{" "}
                    {Result?.formatted?.firstPrizeAmount}<span className="text-sm">Pkr</span>
                  </h5>
                )}
                {Result?.formatted?.secondPrizeAmount != "Unknown" && (
                  <h5>
                    <span className="text-black">2nd Prize:</span>{" "}
                    {Result?.formatted?.secondPrizeAmount}<span className="text-sm">Pkr</span>
                  </h5>
                )}
                {Result?.formatted?.thirdPrizeAmount != "Unknown" && (
                  <h5>
                    <span className="text-black">3rd Prize:</span>{" "}
                    {Result?.formatted?.thirdPrizeAmount}<span className="text-sm">Pkr</span>
                  </h5>
                )}
              </div>

              {/* <h4>City: {Result.formatted.drawNumber}</h4>
          <h4>Prize Price: {Result.formatted.drawNumber}</h4> */}

              <div className="p-4">
                {/* <h2 className="text-2xl font-bold mb-4 text-center">Your Results</h2> */}
                {match && (
                  <table className="w-full border text-lg">
                    <thead className="bg-cyan-950 text-white">
                      <tr>
                        <th className="p-2 border">#</th>
                        <th className="p-2 border">Bond Number</th>
                        <th className="p-2 border">Result</th>
                      </tr>
                    </thead>
                    <tbody>
                      {match.map((item, index) => (
                        <tr key={index} className="text-center ">
                          <td className="border p-2">{index + 1}</td>
                          <td className="border p-2">{item.num}</td>
                          <td className="border p-2">
                            <span className="text-red-800 font-bold">
                              {item.result}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  )
}

export default BondCheck
