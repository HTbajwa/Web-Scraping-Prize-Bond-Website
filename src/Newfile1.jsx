import React, { useState } from "react";
const Newfile1 = () => {
  const [baseurl, setbaseurl] = useState(
    "https://savings.gov.pk/wp-content/uploads/2025/02/Rs.100-49th-Draw-RWP-Final.txt"
  );

  
  const [jsonData, setjsonData] = useState("");
  const [drawno, setdrawno] = useState("");
  const [year, setyear] = useState("");
  const [date, setdate] = useState("");

  const fetchResult = async () => {
    try {
      const proxy = baseurl;
      const response = await fetch(proxy);
      console.log("selected file response", response);
      if (!response.ok) {
        console.log("fetch selected file error");
      } else {
        const textfile = await response.text();
        console.log(textfile);

        const text2 = textfile; 
        const cleanText2 = text2
          .replace(/\u00A0/g, " ")
          .replace(/\s+/g, " ")
          .trim();

        const drawNo =
          cleanText2.match(
            /DRAW\s*NO[\.:]?\s*:?[\s]*([0-9]{1,3})(?:ST|ND|RD|TH)?/i
          )?.[1] ||
          cleanText2.match(/(\d{1,3})(?:ST|ND|RD|TH)?\s*DRAW/i)?.[1] ||
          "Unknown";

        const drawCity2 =
          text2.match(/SBP\s+BSC\s+(\w+)/i)?.[1]?.trim() ||
          text2.match(/HELD\s+AT\s+(\w+)/i)?.[1]?.trim() ||
          text2.match(/HELD\s+ON\s+(\w+)/i)?.[1]?.trim() ||
          text2.match(/HELD\s+AT\s*"?\s*(\w+)/i)?.[1]?.trim() ||
          "Unknown";
        const firstPrizeAmount2 =
          text2.match(/First\s+Prize\s+of\s+Rs\.?\s*([\d,]+)/i)?.[1] ||
          text2.match(/\bFirst\s+Price\s+([\d,]+)/i)?.[1] ||
          "Unknown";
        const secondPrizeAmount2 =
          text2.match(/Second\s+Prize\s+of\s+Rs\.?\s*([\d,]+)/i)?.[1] ||
          text2.match(/Second\s+Prize\s+of\s+Rs\.+Rs\.?\s*([\d,]+)/i)?.[1] ||
          text2.match(/\bSecond\s+Price\s+([\d,]+)/i)?.[1] ||
          "Unknown";
        const thirdPrizeAmount2 =
          text2.match(/Third\s+Prizes?\s+of\s+Rs\.?\s*([\d,]+)/i)?.[1] ||
          text2.match(/Third\s+Prize?\s+of\s+Rs\.?\s*([\d,]+)/i)?.[1] ||
          text2.match(/Third\s+Price?\s+of\s+Rs\.?\s*([\d,]+)/i)?.[1] ||
          text2.match(/Prizes?\s+of\s+Rs\.?([\d,]+)\/-/i)?.[1] ||
          text2.match(/\(\d+\s+Prizes?\s+of\s*Rs\.?[\d,]+\/-\s*Each\)/i)?.[1] ||
          text2.match(/660\s+Prizes?\s+of\s+Rs\.?\s*([\d,]+)/i)?.[1] ||
          text2.match(/\(660\s+Prizes?\s+of\s*Rs\.?([\d,]+)/i)?.[1] ||
          text2.match(/2394\s+Prize(?:\(s\)|s)?\s+of\s*([\d,]+)/i)?.[1] ||
          text2.match(/\(2,394\s+Prizes?\s+of\s*Rs\.\s+?([\d,]+)/i)?.[1] ||
          text2.match(/\{2,394\s+Prizes?\s+of\s*Rs\.\s+?([\d,]+)/i)?.[1] ||
          text2.match(/1696\s+Prize\(s\)\s+of\s*([\d,]+)/i)?.[1] ||
          text2.match(/\{1696\s+Prizes?\s+of\s*Rs\.?([\d,]+)/i)?.[1] ||
          "Unknown";

        const firstPrize2 =
          text2.match(/First\s+Prize[\s\S]*?(\d{5,6})/i)?.[1]?.trim() ||
          text2.match(/First Prize.*?\n+(\d+)/i)?.[1]?.trim() ||
          text2.match(/(\d+)\s+First\s+Price/i) ||
          "Not found";

        const secondPrizeRaw2 =
          text2
            .match(/Second\s+Prize[\s\S]*?(\d{5,6}(?:\s+\d{5,6}){0,})/i)?.[1]
            ?.trim() || "";
        const secondPrizes2 = secondPrizeRaw2?.match(/\d{5,6}/g) || [];
        const thirdPrizeNumbers2 =
          text2
            .match(/\d+/g)
            ?.filter(
              (num) =>
                num.length >= 5 &&
                num !== firstPrize2 &&
                !secondPrizes2.includes(num)
            ) || [];

        // return formatted structure
        const MainResult2 = {
          mainurl: baseurl,
          formatted: {
            drawNumber: drawNo,
            drawCity: drawCity2,
            firstPrizeAmount: firstPrizeAmount2,
            secondPrizeAmount: secondPrizeAmount2,
            thirdPrizeAmount: thirdPrizeAmount2,
            firstPrize2,
            secondPrizes2,
            otherBondNumbers: thirdPrizeNumbers2,
          },
        };
        console.log(MainResult2);

        setjsonData(MainResult2);
      }
    } catch (error) {
      console.log("fetch Result:", error);
    }
  };
  const downloadfile = async () => {
    const blob = new Blob([JSON.stringify(jsonData, null, 2)], {
      type: "application/json",
    });
    const OBJURL = URL.createObjectURL(blob);
    const linkfile = document.createElement("a");
    linkfile.href = OBJURL;
    if (!year && !date && !drawno) {
      console.log("error");
      alert("fill all fields");
    } else {
      linkfile.download = `${year}-${date}-${drawno}`;
      linkfile.click();
    }

    document.body.appendChild(linkfile);

    document.body.removeChild(linkfile);
    URL.revokeObjectURL(OBJURL);

    console.log(OBJURL);
  };

  return (
    <div className="p-2 flex items-center justify-center flex-col">
      <input
        type="url"
        value={baseurl}
        onChange={(e) => setbaseurl(e.target.value)}
        className="border px-3 py-2 rounded w-3/4"
      />
      <button
        className="p-2 bg-cyan-600 mt-4 rounded hover:bg-cyan-950 cursor-pointer ml-2"
        onClick={fetchResult}
      >
        Convert to json
      </button>
      <br />
      <br />
      <div className="flex flex-col w-1/2 gap-2 mb-2">
        <label htmlFor="">Year</label>
        <input
          required
          value={year}
          onChange={(e) => setyear(e.target.value)}
          id="input1"
          className="outline rounded-md pl-2 outline-amber-400"
          type="text"
          placeholder="year"
        />
        <label htmlFor="">Date</label>
        <input
          required
          value={date}
          onChange={(e) => setdate(e.target.value)}
          id="input2"
          className="outline rounded-md pl-2 outline-amber-400"
          type="text"
          placeholder="date"
        />
        <label htmlFor="">Draw</label>
        <input
          required
          value={drawno}
          onChange={(e) => setdrawno(e.target.value)}
          id="input3"
          className="outline rounded-md pl-2 outline-amber-400"
          type="text"
          placeholder="Draw no"
        />
      </div>
      <center>
        <button
          className="p-2 bg-cyan-600 rounded hover:bg-cyan-950 cursor-pointer ml-2"
          onClick={downloadfile}
        >
          Download file
        </button>
      </center>
     {
        jsonData &&  <div className="bg-white mt-2 text-black">
        {<h1>{JSON.stringify(jsonData, null, 2)}</h1>}
      </div>
     }
    </div>
  );
};

export default Newfile1;
