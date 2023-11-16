import React, { useEffect, useState } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Stack from "react-bootstrap/Stack";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {micromark} from 'micromark'
import {gfmTable, gfmTableHtml} from 'micromark-extension-gfm-table'
import "./loading.css";

function MarkdownBlocks() {
  const [keyword, setKeyword] = useState("");
  const [markdown, setMarkdown] = useState("");
  let today = new Date();
  const [dateRange, setDateRange] = useState([new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000), new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000)]);
  const [startDate, endDate] = dateRange;

  const handleInputChange = (e) => {
    setKeyword(e.target.value);
  };

  function submit() {
    console.log("Keyword:", keyword);
    let url = "http://140.120.182.177:11251/analyze/" + keyword + ("?tag=%E6%96%B0%E8%81%9E&K=5&size=10000&start=" + startDate.getTime().toString().slice(0, -3) + "&end=" + endDate.getTime().toString().slice(0, -3))
    setMarkdown("loading");
    // console.log(url);
    // console.log(startDate.getTime().toString().slice(0, -3));
    // console.log(endDate.getTime().toString().slice(0, -3));
    axios
      .get(url)
      .then((res) => {
        setMarkdown(res.data);
      })
      .catch((err) => {
        console.log("error: ", err);
        setMarkdown("# 發生錯誤")
      });
  }

  return (
    <Stack gap={3}>
      <Stack direction="horizontal" gap={3}>
        <Form.Control
          id="keywordTextArea"
          className="me-auto"
          placeholder="Please input your keyword."
          value={keyword}
          onChange={handleInputChange}
        />
        <Button variant="secondary" onClick={submit}>
          Submit
        </Button>
        <DatePicker
          selectsRange={true}
          startDate={startDate}
          endDate={endDate}
          onChange={(update) => {
            setDateRange(update);
          }}
          isClearable={true}
        />
      </Stack>

      {markdown == "loading" ? (
        <div className="loader"></div>
      ) : (
        <Markdown className="my-table-class" remarkPlugins={[remarkGfm, gfmTable]} rehypePlugins={[rehypeRaw]}>
          {markdown}
        </Markdown>
      )}
    </Stack>
  );
}

export default MarkdownBlocks;
