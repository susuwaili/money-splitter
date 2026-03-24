import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';

export default function App() {
  const [input, setInput] = useState('');
  const [limit, setLimit] = useState('3000');
  const [koYuList, setKoYuList] = useState([]);
  const [daiTinList, setDaiTinList] = useState([]);
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
    const lim = parseInt(limit);

    const perms = getPermutations(code);

    let newKoYu = [];
    let newDaiTin = [];
    let updatedExisting = { ...existing };

    perms.forEach(num => {
      let current = updatedExisting[num] || 0;

      if (current >= lim) {
        newDaiTin.push({ num, amount });
        return;
      }

      let total = current + amount;

      if (total <= lim) {
        newKoYu.push({ num, amount });
        updatedExisting[num] = total;
      } else {
        let allowed = lim - current;

        if (allowed > 0) {
          newKoYu.push({ num, amount: allowed });
        }

        newDaiTin.push({ num, amount: amount - allowed });
        updatedExisting[num] = lim;
      }
    });

    setKoYuList([...koYuList, ...newKoYu]);
    setDaiTinList([...daiTinList, ...newDaiTin]);
    setExisting(updatedExisting);
    setInput('');
  };

  const clearAll = () => {
    setKoYuList([]);
    setDaiTinList([]);
    setExisting({});
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Money Splitter</Text>

      <TextInput
        placeholder="ဥပမာ 234R8000"
        value={input}
        onChangeText={setInput}
        style={styles.input}
      />

      <TextInput
        placeholder="Limit (3000)"
        value={limit}
        onChangeText={setLimit}
        style={styles.input}
        keyboardType="numeric"
      />

      <Button title="Split" onPress={handleSplit} />
      <Button title="Clear All" onPress={clearAll} />

      <Text style={styles.header}>ကိုအယူ</Text>
      <FlatList
        data={koYuList}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <Text>{item.num} - {item.amount}</Text>
        )}
      />

      <Text style={styles.header}>ဒိုင်တင်</Text>
      <FlatList
        data={daiTinList}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <Text>{item.num} - {item.amount}</Text>
        )}
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
