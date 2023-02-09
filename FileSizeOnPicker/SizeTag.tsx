//import React, { useState, useEffect } from "react";
import { getByProps, React, Forms, ReactNative } from "aliucord/metro";
import { Text } from "react-native";
import FileSizeOnPicker from ".";
import { formatBytes } from "./util";

export function SizeTag(props) {
  const [size, setSize] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  const { url } = props;

  const { DCDFileManager } = ReactNative.NativeModules;

  //--> aa = fetch('content://media/external/file/39191',{method:'HEAD',headers: {'X-HTTP-Method-Override': 'HEAD'}}).then(m => aa=m)

    React.useEffect(() => {
        async function fetchData() {
            if(!FileSizeOnPicker.instance.SIZE_CACHE[url]){
                /*fetch(url).then(f => f.blob()).then(file => {
                    FileSizeOnPicker.instance.SIZE_CACHE[url] = file.size
                    setSize(formatBytes(file.size));
                    setLoading(false);
                })*/
                DCDFileManager.getSize(url).then(size => {
                    FileSizeOnPicker.instance.SIZE_CACHE[url] = size
                    setSize(formatBytes(size));
                    setLoading(false);
                })
            } else {
                setSize(formatBytes(FileSizeOnPicker.instance.SIZE_CACHE[url]));
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    if (loading) {
        return <Text style={{
            color: 'white'
        }}>...</Text>;
    }

    return <Text style={{
        color: 'white'
    }}>{size}</Text>;
}