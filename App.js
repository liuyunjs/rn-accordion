/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React from 'react';
import { Text } from 'react-native';
import { AccordionFlatList, AccordionPanel, AccordionContent } from './library';

const Item = React.memo(({ item }) => {
  const [count, setCount] = React.useState(6);

  return (
    <>
      <AccordionPanel style={{ height: 100 }}>
        <Text style={{ fontSize: 30 }}>{item}</Text>
      </AccordionPanel>
      <AccordionContent>
        <Text onPress={() => setCount(count + 1)} style={{ fontSize: 24 }}>
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

export default function () {
  return (
    <AccordionFlatList
      accordion={false}
      renderItem={({ item }) => {
        return <Item item={item} />;
      }}
      keyExtractor={(i) => i + ''}
      data={new Array(100).fill(0).map((v, i) => i)}
    />
  );
}
