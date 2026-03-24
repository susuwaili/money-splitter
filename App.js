import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';

export default function App() {
  const [input, setInput] = useState('');
  const [limit, setLimit] = useState(3000);
  const [myList, setMyList] = useState([]);
  const [dineList, setDineList] = useState([]);
  const [existing, setExisting] = useState({});

  const getPermutations = (num) => {
    const result = new Set();

    const permute = (arr, m = []) => {
      if (arr.length === 0) {
        result.add(m.join(''));
      } else {
        for (let i = 0; i < arr.length; i++) {
          let curr = arr.slice();
          let next = curr.splice(i, 1);
          permute(curr.slice(), m.concat(next));
        }
      }
    };

    permute(num.split(''));
    return Array.from(result);
  };

  const handleSplit = () => {
    const match = input.match(/(\d+)R(\d+)/);
    if (!match) return;

    const code = match[1];
    const amount = parseInt(match[2]);

    const perms = getPermutations(code);

    let newMy = [];
    let newDine = [];
    let updated = { ...existing };

    perms.forEach(num => {
      let current = updated[num] || 0;

      if (current >= limit) {
        newDine.push({ num, amount });
        return;
      }

      let total = current + amount;

      if (total <= limit) {
        newMy.push({ num, amount });
        updated[num] = total;
      } else {
        let allowed = limit - current;

        if (allowed > 0) {
          newMy.push({ num, amount: allowed });
        }

        newDine.push({ num, amount: amount - allowed });
        updated[num] = limit;
      }
    });

    setMyList([...myList, ...newMy]);
    setDineList([...dineList, ...newDine]);
    setExisting(updated);
    setInput('');
  };

  const clearAll = () => {
    setMyList([]);
    setDineList([]);
    setExisting({});
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Money Splitter</Text>

      <TextInput
        placeholder="Enter 234R8000"
        value={input}
        onChangeText={setInput}
        style={styles.input}
      />

      <TextInput
        placeholder="Limit (3000)"
        value={limit.toString()}
        onChangeText={(t) => setLimit(parseInt(t) || 0)}
        style={styles.input}
        keyboardType="numeric"
      />

      <Button title="Split" onPress={handleSplit} />
      <Button title="Clear All" onPress={clearAll} />

      <Text style={styles.header}>My List</Text>
      <FlatList
        data={myList}
        keyExtractor={(item, i) => i.toString()}
        renderItem={({ item }) => <Text>{item.num} - {item.amount}</Text>}
      />

      <Text style={styles.header}>Dine List</Text>
      <FlatList
        data={dineList}
        keyExtractor={(item, i) => i.toString()}
        renderItem={({ item }) => <Text>{item.num} - {item.amount}</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, marginTop: 40 },
  title: { fontSize: 22, fontWeight: 'bold' },
  input: { borderWidth: 1, marginVertical: 10, padding: 10 },
  header: { marginTop: 20, fontSize: 18, fontWeight: 'bold' }
});
