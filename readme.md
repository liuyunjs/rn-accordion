# rn-accordion
基于 react-native-reanimated 实现的手风琴组件

## 安装

### yarn
```shell
yarn add rn-accordion react-native-reanimated
```
### npm
```shell
npm install --save rn-accordion react-native-reanimated
```


## 示例
```typescript jsx
import * as React from 'react';
import { SafeAreaView, Text } from 'react-native';
import {
  AccordionFlatList,
  AccordionPanel,
  AccordionContent,
} from 'rn-accordion';

const Item = React.memo(({ item }: { item: any }) => {
  const [count, setCount] = React.useState(6);

  return (
    <>
      <AccordionPanel style={{ height: 100, backgroundColor: 'blue' }}>
        <Text style={{ fontSize: 30 }}>{item}</Text>
      </AccordionPanel>
      <AccordionContent style={{ backgroundColor: 'red' }}>
        <Text onPress={() => setCount(count + 10)} style={{ fontSize: 24 }}>
          {item} -1
        </Text>
        {new Array(count).fill(0).map((v, i) => {
          return (
            <Text key={i} style={{ fontSize: 16 }}>
              {item}
              {i}
            </Text>
          );
        })}
      </AccordionContent>
    </>
  );
});

function App () {
  return (
    <SafeAreaView>
      <AccordionFlatList
        // accordion
        renderItem={({ item }) => {
          return <Item item={item} />;
        }}
        // selected={'2'}
        keyExtractor={(i) => i + ''}
        data={new Array(100).fill(0).map((v, i) => i)}
      />
    </SafeAreaView>
  );
}
```
