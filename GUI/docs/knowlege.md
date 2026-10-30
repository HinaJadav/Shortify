# Knowledge notes

## ngrok

![ngrok explanation](images/ngrok.png)

**ngrok creates a secure public internet link to your local computer.**

This allows you to scan the Expo QR code and test your app on a physical phone **even if your phone and computer are on different Wi-Fi networks** or mobile data.

## Why is useState's value a `const`?

1. **Why `const`?**
   `count` is a read-only snapshot for one render. You should never change it directly, only through `setCount`. `const` enforces that.

2. **How does `setCount` update it if it's `const`?**
   It doesn't change your variable. React keeps the real value in its own storage, outside your component. `setCount`:
   - writes the new value into React's storage
   - tells React to re-render

3. **What a re-render means**
   React calls your component function again. `useState` reads the latest stored value and returns it, and your code creates a brand-new `const count` with that value. No `const` is ever reassigned. Each render just gets its own.

4. **The old value stays old**
   Inside the same render, `count` keeps its old value even after `setCount`:

   ```js
   setCount(count + 1);
   console.log(count); // still the old value
   ```

   The new value appears only in the next render.

5. **What if you use `let`?**
   It still works, because each render creates a fresh variable anyway. But it allows a silent bug:

   ```js
   count = count + 1; // no error, but React's storage is unchanged,
                      // so no re-render and the UI doesn't update
   ```

   With `const`, that line throws an error right away, so you catch the mistake immediately.

**One-line takeaway:** state lives in React, not in your variable. `setCount` updates React's copy and triggers a re-render, and `const` makes sure you never try to update it any other way.

## useColorScheme

`useColorScheme` is a React Native hook that tells you the **phone's current theme**.

```tsx
import { useColorScheme } from 'react-native';

const scheme = useColorScheme(); // 'light' | 'dark' | null
```

- It returns `'light'` or `'dark'`, or `null` if unknown.
- **It updates live.** When the phone switches theme, the component re-renders with the new value.
- It only **reads** the theme. It can't change the phone's theme.
- **Expo catch:** app.json needs `"userInterfaceStyle": "automatic"`. Otherwise it always returns `'light'`.

**Usage:**

```tsx
const colors = scheme === 'dark' ? darkColors : lightColors;
```

## Deep links (§7)

A **deep link** is a URL that opens your app **on a specific screen**, not just the home screen.

**A web example:** a link like `youtube.com/watch?v=abc` opens the YouTube app **directly on that video**.

### How it looks

```
shortify://add
   ↑         ↑
 scheme    path (which screen)
```

- **Scheme** (`shortify://`) is your app's own "address". Android sends any link with this scheme to your app.
- **Path** (`add`, `edit/5`) tells the app which screen to show, and can carry params.

### Two kinds on Android

| Kind | Example | Notes |
|---|---|---|
| **Custom scheme** | `shortify://add` | Simple, and enough for your app. |
| **App Links** | `https://shortify.app/add` | Needs a real website to prove you own the domain. Your app has no website, so skip it. |

### How it works (simplified)

1. Something opens `shortify://add`.
2. Android checks which app registered the `shortify` scheme (an intent filter in **AndroidManifest**, which Expo writes for you from `"scheme"` in app.json).
3. Android opens your app and passes the URL.
4. The navigation library reads the path and shows the **Add** screen.

### Where your app uses it

- **Quick Settings tile** "New entry" opens `shortify://add` (Phase 6).
- **Widget**: tapping a pinned item could open `shortify://edit/5`.
- **Testing:** you can open screens straight from a link or the terminal.

### React Navigation vs Expo Router

| | React Navigation | Expo Router |
|---|---|---|
| Setup | You write a small `linking` config: `{ Add: 'add', Edit: 'edit/:id' }` | Automatic, because file names are already paths |
| Effort for your 1–2 links | About 10 lines, once | None |

**Interview ⭐:** "What's the difference between a custom scheme and App Links?" Custom schemes are easy, but any app can claim them. App Links are verified against your website, so they're secure and open without a "choose app" popup.

## ScrollView vs FlatList (§6 ⭐)

### ScrollView: renders everything at once

```tsx
<ScrollView>
  {entries.map((e) => (
    <Text key={e.id}>{e.key}</Text>
  ))}
</ScrollView>
```

- It creates **all** items immediately, even the ones off screen.
- That's fine for **10–20 items**.
- With **500 entries** it creates 500 rows at start-up: slow loading, high memory, laggy scrolling.

### FlatList: renders only what's near the screen

```tsx
<FlatList
  data={entries}                              // the array
  keyExtractor={(item) => String(item.id)}    // unique key per item (a string)
  renderItem={({ item }) => <Text>{item.key}</Text>}  // how to draw ONE item
/>
```

It's **virtualized**: it renders only the visible items plus a small buffer, and removes items that scroll far away.

```
         ┌─────────────┐
 removed │  item 1     │  ← far above: unmounted
         ├─────────────┤
 buffer  │  item 7     │
         ╞═════════════╡
 SCREEN  │  item 8     │  ← visible
         │  item 9     │
         ╞═════════════╡
 buffer  │  item 10    │
         ├─────────────┤
 not yet │  item 500   │  ← never rendered until you scroll near
         └─────────────┘
```

### Comparison

| | ScrollView | FlatList |
|---|---|---|
| Renders | All items | Only the visible ones plus a buffer |
| Good for | Small, fixed content (forms, settings) | Long or growing lists (your entries) |
| Memory with 500 items | High | Low |
| You write | `.map()` + `key` | `data` + `renderItem` + `keyExtractor` |
| Extras built in | — | Empty state, header, separators, pull-to-refresh, load more |

### Useful FlatList props you'll use

| Prop | What it does | Subtask |
|---|---|---|
| `ListEmptyComponent` | Shown when `data` is empty | 1.6 |
| `ListHeaderComponent` | Content above the list (e.g. search box) | 1.5 |
| `ItemSeparatorComponent` | A line between rows | 1.2 |
| `keyboardShouldPersistTaps` | Lets taps work while the keyboard is open | 1.4 |
| `initialNumToRender`, `windowSize`, `getItemLayout` | Performance tuning | Phase 7 |

### Why keys matter ⭐

A key tells React **which item is which** between renders. Without stable keys, deleting item 2 can make React reuse the wrong row (wrong text, wrong state). Use the **id**, never the array index.

### Common mistake ⭐

**Don't put a FlatList inside a ScrollView** that scrolls the same direction. The ScrollView makes the FlatList render everything, so virtualization is lost, and RN shows a warning. Use `ListHeaderComponent` for content above the list instead.

### Interview answers

1. **Why FlatList over ScrollView?** FlatList is virtualized: it only renders what's on or near the screen, so long lists stay fast and use little memory.
2. **When is ScrollView fine?** For small, fixed content like a form or settings page.
3. **What does `keyExtractor` do?** It gives each item a unique, stable string key, so React can track items between renders.

## FlatList in depth: renderItem, keys, virtualization, batches (§6 ⭐)

### renderItem and keyExtractor
- `renderItem={({ item }) => <EntryRow entry={item} />}` is a **recipe for ONE row**. FlatList calls it for each row it decides to draw, passing `{ item, index }`.
- **You never write the loop.** FlatList decides which rows to draw and when. With `.map()` you loop over ALL items every time.
- `keyExtractor={(item) => String(item.id)}` gives each row a unique, stable **string** name tag. React uses keys to know which row is which after the list changes.
- Use the **id**, never the index: after a delete, index keys make React reuse the wrong row (wrong text, wrong state).

### Virtualization
Only rows **near the screen** exist; the rest are empty space of the right height.

| Prop | Default | Meaning |
|---|---|---|
| `initialNumToRender` | 10 | Rows drawn in the very first render |
| `windowSize` | 21 | Window in screen heights: 10 above + 1 visible + 10 below |
| `maxToRenderPerBatch` | 10 | Max rows created in one batch |
| `updateCellsBatchingPeriod` | 50 ms | Pause between batches |

- Rows **entering** the window are created (`renderItem` runs); rows **leaving** it are **unmounted** (destroyed), so any `useState` inside a row is lost.

### Batches: the road builder 👷🚗
- The screen is a car; FlatList is a builder laying road **ahead** of it.
- **Batch** = 10 rows built, then a **short break** (50 ms), then 10 more.
- **Long stop:** when the road is ready about **10 screens ahead**. Then he waits.
- **Starts again:** when you **scroll**, because the road ahead is shorter again.
- He **doesn't wait for you to reach the last row**; he works ahead. You only see blanks if you scroll faster than he builds.
- **Why batches at all:** JS runs on one thread. Rendering 200 rows at once would freeze taps and typing; small batches leave breaks for them.

```
open app  → build, break, build, break… → road ready → STOP
you scroll → START → build, break…       → road ready → STOP
```

### Batch vs page

| | Batch | Page (pagination) |
|---|---|---|
| Chunks | **Drawing** rows | **Loading** data |
| Data | Already in memory | Not loaded yet (server / DB) |
| Who | FlatList, automatically | You (`onEndReached` + `loadMore`) |
| Trigger | Window not full yet (timer, scroll) | User nears the end of loaded data |

### FlatList vs FlashList

| | FlatList | FlashList (`@shopify/flash-list`) |
|---|---|---|
| Rows leaving the window | **Destroyed**, new ones created | **Recycled**: the same view is reused with new data |
| Speed on long lists | OK | Faster, smoother |
| Row state risk | State lost when unmounted | State can **leak to another item** (recycled view) |
| When | Short/medium lists | Hundreds+ items, complex rows (decision G2, Phase 7) |

### Common mistakes
- FlatList inside a same-direction ScrollView: virtualization is lost (warning).
- No `flex: 1` on the parent: list doesn't scroll.
- Index as key: wrong rows update after delete.
- Important state inside a row: lost (FlatList) or leaked (FlashList). Keep it in the parent / `useEntries`.

### Interview answers
1. **Why FlatList over ScrollView?** It virtualizes: only rows near the screen are rendered, so long lists stay fast and light.
2. **What is virtualization?** Rendering only a window around the visible area (21 screens by default) and unmounting rows outside it.
3. **Why batches?** To avoid blocking the single JS thread, so taps and typing stay responsive.
4. **FlatList vs FlashList?** FlatList unmounts and remounts rows; FlashList recycles row views, so it's faster for long lists, but row-local state can leak between items.

## useState<Entry[]>: typing state

**In one sentence:** `<Entry[]>` tells TypeScript what the state holds; it's optional when the starting value already has that type (`useState(SAMPLE_ENTRIES)`), but required when the start is `[]` or `null`, because TypeScript would otherwise infer `never[]` or `null` and reject real entries later.

```ts
useState(SAMPLE_ENTRIES)                 // inferred Entry[] ✅ (optional to write)
useState([])                             // inferred never[] ❌ setEntries([entry]) fails
useState<Entry[]>([])                    // ✅ required (Phase 3 starts empty)
useState<Entry | null>(null)             // ✅ required for "nothing selected yet"
```

## StyleSheet vs NativeWind (§5)

### The problem both solve
React Native has **no CSS files** and no `className`. Every component is styled with **JavaScript objects** passed to the `style` prop. The question is **how you write those styles**.

### StyleSheet: built into React Native

```tsx
import { StyleSheet, Text, View } from 'react-native';

<View style={styles.row}>
  <Text style={styles.key}>email</Text>
</View>

const styles = StyleSheet.create({
  row: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#ddd' },
  key: { fontWeight: 'bold' },
});
```

- **Comes with React Native**, so there's nothing to install.
- Property names are **camelCase** (`borderBottomWidth`), numbers have **no units** (`16`, not `16px`).
- `StyleSheet.create` defines styles **once**, outside the component; TypeScript catches typos like `paddng`.
- **Dynamic styles**: `style={[styles.row, isPinned && styles.pinned]}`.
- **Analogy:** a recipe book. Each style has a **name**, and you look it up by name.

### NativeWind: Tailwind classes for React Native
A **third-party library** that lets you write **Tailwind CSS** utility classes with `className`:

```tsx
<View className="p-4 border-b border-gray-300">
  <Text className="font-bold">email</Text>
</View>
```

- `p-4` = padding 16, `border-b` = bottom border, `font-bold` = bold.
- At build time it **converts classes into the same RN style objects**.
- **Needs installing and setup**: `nativewind`, `tailwindcss`, Tailwind config, Babel/Metro changes.
- **Dark mode** built in: `className="bg-white dark:bg-black"`.
- **Analogy:** ready-made **stickers** you put directly on each element.

### Side by side

| | **StyleSheet** | **NativeWind** |
|---|---|---|
| Comes with RN | ✅ Built in | ❌ Library plus setup |
| Where styles live | Named objects, usually at the bottom of the file | Short classes on each element |
| Syntax | `style={styles.row}` | `className="p-4 border-b"` |
| Learning | Only RN style properties | RN properties **plus** Tailwind names |
| Dark mode | You build it (A2 ThemeProvider) | Built in with `dark:` |
| Interviews | **Always asked** | Nice to know |

### Common mistakes

| Mistake | Symptom |
|---|---|
| CSS units: `padding: '16px'` | Error or ignored. Use `16`. |
| Kebab-case: `'border-width'` | TypeScript error. Use `borderWidth`. |
| `className` without NativeWind | Ignored; no styles appear. |
| Inline objects everywhere (`style={{ padding: 16 }}`) | New object every render; harder to reuse and read. |

### Interview answers
1. **Why `StyleSheet.create`?** Styles defined once, reusable named styles, and TypeScript validates property names.
2. **RN styling vs CSS?** No cascade/inheritance (except text inside `Text`), camelCase, unitless numbers, Flexbox by default with `flexDirection: 'column'`.
3. **What's NativeWind?** Tailwind utility classes for RN via `className`, compiled into RN style objects.

## Safe areas (§5)

### The problem
On Android 15+, the app is drawn **edge to edge**: behind the status bar at the top and the **gesture bar** at the bottom.
- **Top:** the Stack **header** already sits below the status bar, so the top is safe.
- **Bottom:** the last list row goes **under the gesture bar**, hard to read and tap.

### Mental model
The **safe area** is the part of the screen that's really yours, not covered by system bars.

**Analogy:** a **picture frame**. The glass covers the whole picture, but the frame's edges hide a strip on each side; keep important things inside the frame.

`react-native-safe-area-context` **measures the frame on each phone**, because bar sizes differ between phones and between gesture and button navigation, and adds exactly that much padding.

### How it works inside
1. **`SafeAreaProvider`** measures the system bars (insets) once at the top of the app. **Expo Router adds it automatically.**
2. **`SafeAreaView`** reads those numbers and adds padding on the edges you choose.
3. `edges={['bottom', 'left', 'right']}`: no `'top'`, because the header already handles it (otherwise: double space).

```tsx
import { SafeAreaView } from 'react-native-safe-area-context';

<SafeAreaView style={{ flex: 1 }} edges={['bottom', 'left', 'right']}>
  ...
</SafeAreaView>
```

### Common mistakes

| Mistake | Symptom |
|---|---|
| Importing `SafeAreaView` from `'react-native'` | No effect on Android (RN's built-in one is iOS only) |
| Adding `'top'` while a header is shown | Double gap at the top |
| Wrapping only the FlatList, not the screen | Other parts can still go under the bars |

### Interview answers
1. **What are safe areas?** Screen parts not covered by system UI (status bar, notch, gesture bar); content should stay inside them.
2. **Why the library, not RN's `SafeAreaView`?** RN's only works on iOS; the library works on both, measures exact insets per device, and lets you choose edges.
3. **`SafeAreaView` vs `useSafeAreaInsets`?** The view adds padding automatically; the hook gives the numbers (`top`, `bottom`…) to apply yourself, e.g. to a floating button.
