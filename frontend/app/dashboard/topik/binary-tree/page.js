'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { fetchTopicProgress, saveTopicProgress } from '../../../lib/progress';

const SECTIONS = [
  { id: 'pengantar',    title: 'Pohon (Tree)',                 level: 0 },
  { id: 'istilah',      title: 'Istilah dalam Pohon',          level: 1 },
  { id: 'def-rekursif', title: 'Definisi Rekursif',            level: 1 },
  { id: 'pohon-biner',  title: 'Pohon Biner',                  level: 0 },
  { id: 'jenis-khusus', title: 'Jenis Pohon Khusus',           level: 1 },
  { id: 'adt',          title: 'ADT Pohon Biner',              level: 0 },
  { id: 'selektor',     title: 'Selektor & Konstruktor',       level: 1 },
  { id: 'predikat',     title: 'Predikat',                     level: 1 },
  { id: 'rekursif',     title: 'Pemrosesan Rekursif',          level: 1 },
  { id: 'preorder',     title: 'Traversal Pre-order',          level: 0 },
  { id: 'inorder',      title: 'Traversal In-order',           level: 1 },
  { id: 'postorder',    title: 'Traversal Post-order',         level: 1 },
  { id: 'nbelmt',       title: 'Fungsi nbElmt',                level: 0 },
  { id: 'nbleaf',       title: 'Fungsi nbLeaf',                level: 1 },
  { id: 'depth',        title: 'Fungsi depth',                 level: 1 },
  { id: 'add-del',      title: 'addLeft & delLeft',            level: 1 },
  { id: 'balanced',     title: 'Pohon Seimbang',               level: 0 },
  { id: 'bst',          title: 'Binary Search Tree',           level: 0 },
  { id: 'bst-ops',      title: 'Insert & Delete BST',          level: 1 },
  { id: 'build-string', title: 'Membangun dari Pita Karakter', level: 0 },
];

const TABS = ['MATERI', 'CONTOH', 'LATIHAN', 'RINGKASAN'];
const TOPIC_SLUG   = 'binary-tree';
const STORAGE_KEY  = 'asd_latihan_binary_tree_soal';
const TAB_KEYS = { MATERI: 'materi', CONTOH: 'contoh', LATIHAN: 'latihan', RINGKASAN: 'ringkasan' };



// ---------------------------------------------------------------------------
// Primitive building blocks
// ---------------------------------------------------------------------------
function SectionHeading({ id, children }) {
  return (
    <h2 id={id} className="text-xl font-bold text-gray-900 mt-10 mb-3 pb-2 border-b-2 border-gray-200 scroll-mt-28">
      {children}
    </h2>
  );
}
function SubHeading({ id, children }) {
  return (
    <h3 id={id} className="text-base font-bold text-gray-800 mt-6 mb-2 scroll-mt-28">
      {children}
    </h3>
  );
}
function P({ children, className = '' }) {
  return <p className={`mb-3 leading-relaxed ${className}`}>{children}</p>;
}
function Mono({ children }) {
  return (
    <code className="bg-gray-100 text-amber-700 text-[13px] px-1.5 py-0.5 rounded font-mono border border-gray-200">
      {children}
    </code>
  );
}
function CodeBlock({ language, children }) {
  return (
    <div className="my-4 rounded-lg overflow-hidden border border-gray-200 text-[13px]">
      {language && (
        <div className="bg-gray-700 text-gray-300 px-4 py-1 font-mono text-xs tracking-wide">{language}</div>
      )}
      <pre className="bg-gray-900 text-green-300 px-5 py-4 overflow-x-auto font-mono leading-relaxed">
        <code>{children.trim()}</code>
      </pre>
    </div>
  );
}
function Pseudocode({ children }) {
  return (
    <pre className="my-4 bg-gray-50 border border-gray-200 rounded-lg px-5 py-4 text-[13px] font-mono text-gray-800 overflow-x-auto leading-relaxed">
      {children.trim()}
    </pre>
  );
}
function AsciiBox({ children }) {
  return (
    <pre className="my-4 bg-amber-50 border border-amber-100 rounded-lg px-5 py-4 text-[13px] font-mono text-amber-900 overflow-x-auto leading-relaxed">
      {children.trim()}
    </pre>
  );
}
function NoteBox({ children }) {
  return (
    <div className="my-4 bg-yellow-50 border-l-4 border-yellow-400 px-4 py-3 rounded-r-lg text-sm text-gray-700">
      <span className="font-semibold text-yellow-700">Catatan: </span>
      {children}
    </div>
  );
}
function InfoBox({ children }) {
  return (
    <div className="my-4 bg-amber-50 border-l-4 border-amber-500 px-4 py-3 rounded-r-lg text-sm text-gray-700">
      {children}
    </div>
  );
}
function UL({ items }) {
  return (
    <ul className="my-3 space-y-1 list-disc list-inside ml-2 text-[15px] text-gray-700">
      {items.map((item, i) => <li key={i}>{item}</li>)}
    </ul>
  );
}
function W3Table({ headers, rows }) {
  return (
    <div className="my-4 overflow-x-auto rounded-lg border border-gray-200">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr>
            {headers.map((h, i) => (
              <th key={i} className="bg-gray-800 text-white px-4 py-2.5 text-left font-semibold border-r border-gray-600 last:border-r-0">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
              {row.map((cell, j) => (
                <td key={j} className="px-4 py-2.5 text-gray-700 border-t border-gray-100 border-r last:border-r-0">{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
function Divider() { return <hr className="my-8 border-gray-200" />; }

// ---------------------------------------------------------------------------
// MATERI full content
// ---------------------------------------------------------------------------
function MateriContent() {
  return (
    <div className="text-[15px] text-gray-700">

      <SectionHeading id="pengantar">Pohon (Tree)</SectionHeading>
      <P><strong>Pohon</strong> adalah struktur data hierarkis yang terdiri dari sekumpulan simpul yang saling terhubung. Pohon didefinisikan secara rekursif:</P>
      <AsciiBox>{`Pohon = Akar + kumpulan SubPohon yang disjoint`}</AsciiBox>
      <P>Contoh nyata penggunaan pohon:</P>
      <AsciiBox>{`Menu aplikasi      → Menu utama sebagai akar, submenu sebagai anak
Susunan bab buku   → Bab sebagai akar, subbab sebagai anak
Pohon keluarga     → Orang tua sebagai akar, anak sebagai child`}</AsciiBox>
      <Divider />

      <SectionHeading id="istilah">Istilah dalam Pohon</SectionHeading>
      <W3Table
        headers={['Istilah', 'Penjelasan']}
        rows={[
          ['Akar (Root)',       'Simpul paling atas, tidak punya parent'],
          ['Ayah (Parent)',     'Simpul yang memiliki anak'],
          ['Anak (Child)',      'Simpul yang memiliki parent'],
          ['Saudara (Sibling)', 'Simpul yang memiliki parent yang sama'],
          ['Daun (Leaf)',       'Simpul tanpa anak (simpul terminal)'],
          ['Jalan (Path)',      'Urutan simpul dari satu simpul ke simpul lain'],
          ['Derajat (Degree)',  'Jumlah anak sebuah simpul'],
          ['Tingkat (Level)',   'Panjang jalan dari akar ke simpul tertentu'],
          ['Kedalaman (Depth)', 'Tingkat terpanjang dalam pohon'],
          ['Lebar (Breadth)',   'Jumlah maksimum simpul pada suatu tingkat'],
        ]}
      />
      <P>Contoh pohon dengan tingkat:</P>
      <AsciiBox>{`        a          ← level 1 (akar)
       / \\
      b   c        ← level 2
     / \\ / \\
    d  e g  h      ← level 3
           |
           i       ← level 4 (kedalaman = 4)

derajat(c) = 2  → c punya 2 anak: g dan h
derajat(h) = 1  → h punya 1 anak: i
derajat(g) = 0  → g tidak punya anak (daun)
tingkat(e) = 3
tingkat(i) = 4
kedalaman pohon = 4`}</AsciiBox>
      <Divider />

      <SectionHeading id="def-rekursif">Definisi Rekursif Pohon</SectionHeading>
      <P>Pohon adalah himpunan terbatas, tidak kosong:</P>
      <AsciiBox>{`Basis    → sebuah simpul tunggal (akar)
Rekurens → akar + sekumpulan subpohon yang disjoint`}</AsciiBox>
      <P>Sufiks <strong>-aire</strong> menunjukkan berapa maksimum subpohon yang dimiliki:</P>
      <AsciiBox>{`Binary (Binaire) → maksimum 2 subpohon
N-aire           → maksimum N subpohon`}</AsciiBox>
      <Divider />

      <SectionHeading id="pohon-biner">Pohon Biner</SectionHeading>
      <P><strong>Pohon biner</strong> adalah himpunan terbatas yang:</P>
      <AsciiBox>{`- Mungkin kosong, atau
- Terdiri dari sebuah akar dan dua subpohon yang disjoint:
  subpohon kiri dan subpohon kanan`}</AsciiBox>
      <AsciiBox>{`        akar
       /    \\
   kiri      kanan
  (subpohon) (subpohon)`}</AsciiBox>
      <P>Contoh pohon biner untuk ekspresi <Mono>3 + (4 * 5)</Mono>:</P>
      <AsciiBox>{`      +
     / \\
    3   *
       / \\
      4   5`}</AsciiBox>
      <Divider />

      <SectionHeading id="jenis-khusus">Jenis Pohon Biner Khusus</SectionHeading>
      <SubHeading>Pohon condong kiri (left skewed tree)</SubHeading>
      <P>Semua simpul hanya punya anak kiri.</P>
      <AsciiBox>{`a
|
b (kiri)
|
c (kiri)`}</AsciiBox>
      <SubHeading>Pohon condong kanan (right skewed tree)</SubHeading>
      <P>Semua simpul hanya punya anak kanan.</P>
      <AsciiBox>{`a
 \\
  b (kanan)
   \\
    c (kanan)`}</AsciiBox>
      <Divider />

      <SectionHeading id="adt">ADT Pohon Biner dengan Representasi Berkait</SectionHeading>
      <P>Pohon biner diimplementasikan sebagai <em>linked structure</em> dengan setiap node memiliki tiga field.</P>
      <SubHeading>Struktur Data (Notasi Algoritmik)</SubHeading>
      <Pseudocode>{`type BinTree: Address

type TreeNode:
  info  : ElType    { nilai simpul / akar }
  left  : BinTree   { subpohon kiri }
  right : BinTree   { subpohon kanan }`}</Pseudocode>
      <P>Pohon biner kosong dinyatakan dengan <Mono>p = NIL</Mono>.</P>
      <SubHeading>Struktur Data dalam Bahasa C</SubHeading>
      <CodeBlock language="c">{`
#define NIL NULL

typedef char ElType;
typedef struct treeNode* Address;
typedef struct treeNode {
    ElType  info;
    Address left;
    Address right;
} TreeNode;

typedef Address BinTree;
      `}</CodeBlock>
      <Divider />

      <SectionHeading id="selektor">Selektor & Konstruktor</SectionHeading>
      <SubHeading>Selektor</SubHeading>
      <P>Jika <Mono>p</Mono> adalah BinTree:</P>
      <Pseudocode>{`p↑.info  → akar dari p
p↑.left  → subpohon kiri p
p↑.right → subpohon kanan p`}</Pseudocode>
      <SubHeading>Konstruktor & Memory Management</SubHeading>
      <Pseudocode>{`function NewTree(akar: ElType, l: BinTree, r: BinTree) → BinTree
{ Menghasilkan pohon biner dari akar, l, dan r jika alokasi berhasil }
{ Menghasilkan NIL jika alokasi gagal }

function newTreeNode(x: ElType) → Address
{ Mengalokasi sebuah node bernilai x }
{ Jika berhasil: p↑.info=x, p↑.left=NIL, p↑.right=NIL }

procedure deallocTreeNode(input/output p: Address)
{ I.S. p terdefinisi. F.S. p dikembalikan ke sistem }`}</Pseudocode>
      <CodeBlock language="c">{`
Address newTreeNode(ElType x) {
    Address p = (Address) malloc(sizeof(TreeNode));
    if (p != NIL) {
        p->info  = x;
        p->left  = NIL;
        p->right = NIL;
    }
    return p;
}
      `}</CodeBlock>
      <Divider />

      <SectionHeading id="predikat">Predikat</SectionHeading>
      <SubHeading>isTreeEmpty</SubHeading>
      <Pseudocode>{`function isTreeEmpty(p: BinTree) → boolean
ALGORITMA
→ (p = NIL)`}</Pseudocode>
      <SubHeading>isOneElmt</SubHeading>
      <Pseudocode>{`function isOneElmt(p: BinTree) → boolean
ALGORITMA
if not(isTreeEmpty(p)) then
    → (p↑.left = NIL) and (p↑.right = NIL)
else
    → false`}</Pseudocode>
      <SubHeading>isUnerLeft, isUnerRight, isBiner</SubHeading>
      <Pseudocode>{`function isUnerLeft(p: BinTree) → boolean
{ true jika p tidak kosong dan hanya punya subpohon kiri }

function isUnerRight(p: BinTree) → boolean
{ true jika p tidak kosong dan hanya punya subpohon kanan }

function isBiner(p: BinTree) → boolean
{ true jika p tidak kosong dan punya subpohon kiri dan kanan }`}</Pseudocode>
      <W3Table
        headers={['Predikat', 'left', 'right', 'Kondisi']}
        rows={[
          ['isTreeEmpty',  '—',    '—',    'p = NIL'],
          ['isOneElmt',    'NIL',  'NIL',  'p ≠ NIL AND left=NIL AND right=NIL'],
          ['isUnerLeft',   '≠NIL', 'NIL',  'p ≠ NIL AND left≠NIL AND right=NIL'],
          ['isUnerRight',  'NIL',  '≠NIL', 'p ≠ NIL AND left=NIL AND right≠NIL'],
          ['isBiner',      '≠NIL', '≠NIL', 'p ≠ NIL AND left≠NIL AND right≠NIL'],
        ]}
      />
      <Divider />

      <SectionHeading id="rekursif">Pemrosesan Rekursif Pohon Biner</SectionHeading>
      <P>Ada dua jenis basis dalam pemrosesan rekursif pohon biner:</P>
      <SubHeading>Basis-0</SubHeading>
      <P>Pohon kosong sebagai basis — menggunakan <Mono>isTreeEmpty</Mono>.</P>
      <Pseudocode>{`if isTreeEmpty(p) then
    { basis: tidak ada yang diproses }
else
    { rekurens }`}</Pseudocode>
      <SubHeading>Basis-1</SubHeading>
      <P>Pohon satu elemen sebagai basis — menggunakan <Mono>isOneElmt</Mono>.</P>
      <Pseudocode>{`if isOneElmt(p) then
    { basis: proses akar saja }
else
    depend on p
        isUnerLeft(p) : { proses kiri saja }
        isUnerRight(p): { proses kanan saja }
        isBiner(p)    : { proses kiri dan kanan }`}</Pseudocode>
      <InfoBox>
        Basis-0 lebih umum digunakan karena lebih sederhana. Basis-1 dipakai ketika pohon dijamin tidak kosong — misalnya pada fungsi <Mono>nbLeaf1</Mono> yang memanggil <Mono>nbLeaf</Mono> sebagai wrapper.
      </InfoBox>
      <Divider />

      <SectionHeading id="preorder">Traversal Pre-order (Akar – Kiri – Kanan)</SectionHeading>
      <Pseudocode>{`procedure printPreOrder(input p: BinTree)
{ I.S. Pohon p terdefinisi }
{ F.S. Semua simpul dicetak dalam urutan pre-order }

ALGORITMA
if isTreeEmpty(p) then
    { do nothing }
else
    output(p↑.info)
    printPreOrder(p↑.left)
    printPreOrder(p↑.right)`}</Pseudocode>
      <AsciiBox>{`        A
       / \\
      B   E
     / \\ / \\
    C  D F  G

Pre-order: A → B → C → D → E → F → G`}</AsciiBox>
      <Divider />

      <SectionHeading id="inorder">Traversal In-order (Kiri – Akar – Kanan)</SectionHeading>
      <Pseudocode>{`procedure printInOrder(input p: BinTree)
ALGORITMA
if isTreeEmpty(p) then
    { do nothing }
else
    printInOrder(p↑.left)
    output(p↑.info)
    printInOrder(p↑.right)`}</Pseudocode>
      <AsciiBox>{`In-order: C → B → D → A → F → E → G`}</AsciiBox>
      <NoteBox>
        In-order pada BST menghasilkan urutan terurut naik — itulah mengapa BST sangat berguna untuk pengurutan data.
      </NoteBox>
      <Divider />

      <SectionHeading id="postorder">Traversal Post-order (Kiri – Kanan – Akar)</SectionHeading>
      <Pseudocode>{`procedure printPostOrder(input p: BinTree)
ALGORITMA
if isTreeEmpty(p) then
    { do nothing }
else
    printPostOrder(p↑.left)
    printPostOrder(p↑.right)
    output(p↑.info)`}</Pseudocode>
      <AsciiBox>{`Post-order: C → D → B → F → G → E → A`}</AsciiBox>
      <InfoBox>
        Post-order berguna untuk menghapus pohon (hapus anak sebelum parent) atau mengevaluasi ekspresi aritmetika (hitung operand sebelum operator).
      </InfoBox>
      <Divider />

      <SectionHeading id="nbelmt">Fungsi nbElmt — Menghitung Jumlah Elemen</SectionHeading>
      <SubHeading>Basis-0 (pohon mungkin kosong)</SubHeading>
      <Pseudocode>{`function nbElmt(p: BinTree) → integer
{ Pohon biner mungkin kosong. Mengirim jumlah elemen dari pohon }

ALGORITMA
if isTreeEmpty(p) then
    → 0
else
    → 1 + nbElmt(p↑.left) + nbElmt(p↑.right)`}</Pseudocode>
      <SubHeading>Basis-1 (pohon tidak kosong)</SubHeading>
      <Pseudocode>{`function nbElmt(p: BinTree) → integer
{ Pohon tidak kosong }

ALGORITMA
if isOneElmt(p) then
    → 1
else
    depend on p
        isUnerLeft(p) : → 1 + nbElmt(p↑.left)
        isUnerRight(p): → 1 + nbElmt(p↑.right)
        isBiner(p)    : → 1 + nbElmt(p↑.left) + nbElmt(p↑.right)`}</Pseudocode>
      <CodeBlock language="c">{`
int nbElmt(BinTree p) {
    if (p == NIL) {
        return 0;
    } else {
        return 1 + nbElmt(p->left) + nbElmt(p->right);
    }
}
      `}</CodeBlock>
      <Divider />

      <SectionHeading id="nbleaf">Fungsi nbLeaf — Menghitung Jumlah Daun</SectionHeading>
      <P>Daun adalah simpul tanpa anak (<Mono>isOneElmt</Mono> = true). Untuk pohon yang mungkin kosong:</P>
      <Pseudocode>{`function nbLeaf(p: BinTree) → integer
ALGORITMA
if isTreeEmpty(p) then
    → 0
else
    → nbLeaf1(p)

function nbLeaf1(p: BinTree) → integer
{ Pohon tidak kosong }
ALGORITMA
if isOneElmt(p) then
    → 1
else
    depend on p
        isUnerLeft(p) : → nbLeaf1(p↑.left)
        isUnerRight(p): → nbLeaf1(p↑.right)
        isBiner(p)    : → nbLeaf1(p↑.left) + nbLeaf1(p↑.right)`}</Pseudocode>
      <Divider />

      <SectionHeading id="depth">Fungsi depth — Tinggi Pohon</SectionHeading>
      <Pseudocode>{`function depth(p: BinTree) → integer
{ Pohon biner mungkin kosong. Mengirim tinggi dari pohon }

ALGORITMA
if isTreeEmpty(p) then
    → 0
else
    → 1 + max(depth(p↑.left), depth(p↑.right))`}</Pseudocode>
      <CodeBlock language="c">{`
int depth(BinTree p) {
    if (p == NIL) {
        return 0;
    } else {
        int dLeft  = depth(p->left);
        int dRight = depth(p->right);
        return 1 + (dLeft > dRight ? dLeft : dRight);
    }
}
      `}</CodeBlock>
      <Divider />

      <SectionHeading id="add-del">addLeft & delLeft</SectionHeading>
      <SubHeading>addLeft — Menambah Daun Terkiri</SubHeading>
      <Pseudocode>{`procedure addLeft(input/output p: BinTree, input x: ElType)
{ I.S. p boleh kosong }
{ F.S. x ditambahkan sebagai daun terkiri }

ALGORITMA
if isTreeEmpty(p) then
    p ← newTreeNode(x)
else
    addLeft(p↑.left, x)`}</Pseudocode>
      <SubHeading>delLeft — Menghapus Daun Terkiri</SubHeading>
      <Pseudocode>{`procedure delLeft(input/output p: BinTree, output x: ElType)
{ I.S. p tidak kosong }
{ F.S. Daun terkiri dihapus, nilainya disimpan di x }

KAMUS LOKAL
n: Address

ALGORITMA
if isOneElmt(p) then
    x ← p↑.info
    n ← p
    p ← NIL
    deallocTreeNode(n)
else
    depend on p
        isUnerRight(p): delLeft(p↑.right, x)
        else           : delLeft(p↑.left, x)`}</Pseudocode>
      <NoteBox>
        Pada <Mono>delLeft</Mono>, jika pohon hanya punya anak kanan maka daun terkiri berada di subpohon kanan.
      </NoteBox>
      <Divider />

      <SectionHeading id="balanced">Pohon Biner Seimbang (Balanced Binary Tree)</SectionHeading>
      <P>Pohon biner seimbang memenuhi:</P>
      <AsciiBox>{`- Selisih tinggi subpohon kiri dan kanan maksimum 1
- Selisih jumlah simpul subpohon kiri dan kanan maksimum 1
- Subpohon kiri dan kanan juga pohon seimbang`}</AsciiBox>
      <AsciiBox>{`N=1:  O

N=3:    O
       / \\
      O   O

N=7:      O
         / \\
        O   O
       / \\ / \\
      O  O O  O`}</AsciiBox>
      <SubHeading>Algoritma Membangun Pohon Seimbang</SubHeading>
      <Pseudocode>{`function buildBalancedTree(n: integer) → BinTree
{ Menghasilkan balanced tree dari n node }

ALGORITMA
if n = 0 then
    → NIL
else
    input(x)
    p ← newTreeNode(x)
    nL ← n div 2
    nR ← n - nL - 1
    p↑.left  ← buildBalancedTree(nL)
    p↑.right ← buildBalancedTree(nR)
    → p`}</Pseudocode>
      <InfoBox>
        Aplikasi pohon seimbang: pengelolaan indeks dalam file system dan database system (B-tree, AVL tree, Red-Black tree).
      </InfoBox>
      <Divider />

      <SectionHeading id="bst">Binary Search Tree (BST)</SectionHeading>
      <P><strong>BST</strong> adalah pohon biner dengan aturan urutan:</P>
      <AsciiBox>{`Semua simpul subpohon kiri  <  Akar
Semua simpul subpohon kanan >= Akar`}</AsciiBox>
      <AsciiBox>{`        8
       / \\
      3   10
     / \\    \\
    1   6    14

1, 3, 6 < 8  → di subpohon kiri
10, 14 >= 8  → di subpohon kanan`}</AsciiBox>
      <P>Struktur data BST (key unik, count menyimpan kemunculan):</P>
      <Pseudocode>{`type ElType:
  key   : ...     { nilai unik }
  count : integer { jumlah kemunculan }`}</Pseudocode>
      <Divider />

      <SectionHeading id="bst-ops">Insert & Delete di BST</SectionHeading>
      <SubHeading>Insert Node ke BST</SubHeading>
      <Pseudocode>{`procedure insSearchTree(input x: ElType, input/output p: BinTree)

ALGORITMA
if isTreeEmpty(p) then
    CreateTree(x, NIL, NIL, p)
else
    depend on x, p↑.info.key
        x.key = p↑.info.key : p↑.info.count ← p↑.info.count + 1
        x.key < p↑.info.key : insSearchTree(x, p↑.left)
        x.key > p↑.info.key : insSearchTree(x, p↑.right)`}</Pseudocode>
      <SubHeading>Delete Node dari BST</SubHeading>
      <P>Penghapusan memiliki empat kasus berdasarkan struktur node yang dihapus:</P>
      <AsciiBox>{`isOneElmt(q)   → p ← NIL
isUnerLeft(q)  → p ← q↑.left
isUnerRight(q) → p ← q↑.right
isBiner(q)     → ganti nilai q dengan daun terkanan subpohon kirinya,
                 lalu hapus daun terkanan tersebut`}</AsciiBox>
      <Pseudocode>{`procedure delNode(input/output p: BinTree)
{ Mencari daun terkanan, salin nilainya ke q, lalu hapus }

ALGORITMA
depend on p
    p↑.right ≠ NIL: delNode(p↑.right)
    p↑.right = NIL:
        q↑.info.key   ← p↑.info.key
        q↑.info.count ← p↑.info.count
        q ← p
        p ← p↑.left`}</Pseudocode>
      <NoteBox>
        Pada kasus <Mono>isBiner</Mono>, node pengganti adalah <em>daun terkanan subpohon kiri</em> (predecessor in-order) — nilainya lebih kecil dari semua node kanan dan lebih besar dari semua node kiri yang tersisa.
      </NoteBox>
      <Divider />

      <SectionHeading id="build-string">Membangun Pohon dari Pita Karakter</SectionHeading>
      <P>Ekspresi pohon ditulis dalam format linier:</P>
      <AsciiBox>{`Format: (akar (subpohon_kiri) (subpohon_kanan))
Pohon kosong: ()

Contoh:
(A()())           → pohon satu simpul A

(A(B()())(C()())) → pohon:
                        A
                       / \\
                      B   C`}</AsciiBox>
      <SubHeading>Membangun Secara Rekursif dengan Indeks String</SubHeading>
      <CodeBlock language="c">{`
void BuildTreeFromString(BinTree *t, char *st, int *idx) {
    (*idx)++;                   /* lewati '(' */
    if (st[*idx] == ')') {
        (*t) = NIL;             /* basis: pohon kosong */
    } else {
        *t = newTreeNode(st[*idx]);
        (*idx)++;               /* lewati karakter akar */
        BuildTreeFromString(&((*t)->left),  st, idx);
        BuildTreeFromString(&((*t)->right), st, idx);
    }
    (*idx)++;                   /* lewati ')' */
}
      `}</CodeBlock>
      <InfoBox>
        Setiap pemanggilan <Mono>BuildTreeFromString</Mono> dimulai tepat di karakter <Mono>(</Mono>. Setelah membaca akar, ia langsung merekursi ke kiri dan kanan, lalu mengakhiri dengan melewati <Mono>)</Mono>.
      </InfoBox>

      {/* Summary card */}
      <div className="mt-10 mb-6 bg-amber-50 border border-amber-200 rounded-xl p-6">
        <h3 className="font-bold text-amber-900 text-base mb-3">Ringkasan Penting</h3>
        <ul className="space-y-1.5 text-sm text-amber-900">
          {[
            'BinTree = pointer ke TreeNode. Pohon kosong = NIL.',
            'Tiga traversal: Pre-order (A-K-K), In-order (K-A-K), Post-order (K-K-A).',
            'nbElmt basis-0: kosong→0, else→1+nbElmt(kiri)+nbElmt(kanan).',
            'depth basis-0: kosong→0, else→1+max(depth(kiri),depth(kanan)).',
            'BST: kiri < akar ≤ kanan. In-order BST = urutan terurut naik.',
            'Format pita karakter: (akar(left)(right)), pohon kosong = ().',
          ].map((item, i) => (
            <li key={i} className="flex gap-2">
              <span className="text-amber-500 font-bold">✓</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// CONTOH content
// ---------------------------------------------------------------------------
function ContohContent() {
  const [showHint, setShowHint] = useState(false);
  const [showJawaban, setShowJawaban] = useState(false);

  return (
    <div className="text-[15px] text-gray-700">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span className="bg-green-100 text-green-700 text-xs font-bold px-2.5 py-1 rounded-full border border-green-200">Easy</span>
          <span className="bg-amber-50 text-amber-700 text-xs font-medium px-2.5 py-1 rounded-full border border-amber-100">Pohon biner</span>
          <span className="bg-amber-50 text-amber-700 text-xs font-medium px-2.5 py-1 rounded-full border border-amber-100">Traversal</span>
          <span className="bg-amber-50 text-amber-700 text-xs font-medium px-2.5 py-1 rounded-full border border-amber-100">Rekursi</span>
        </div>
        <h2 className="text-xl font-bold text-gray-900">Menentukan Traversal Pre-order</h2>
      </div>

      {/* Deskripsi */}
      <div className="mb-5">
        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-2">Deskripsi</h3>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 leading-relaxed">
          <p>
            Diberikan sebuah pohon biner dalam format pita karakter. Cetak semua simpul pohon tersebut dalam urutan <strong>pre-order</strong> (akar - kiri - kanan), dipisahkan spasi.
          </p>
          <p className="mt-2">
            Format pita karakter:{' '}
            <code className="font-mono bg-white border border-gray-200 text-amber-700 px-1.5 rounded text-[13px]">
              (akar(subpohon_kiri)(subpohon_kanan))
            </code>
            . Pohon kosong ditulis <code className="font-mono text-amber-700">()</code>.
          </p>
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <p className="text-xs font-semibold text-gray-500 mb-1">Input:</p>
              <pre className="bg-white border border-gray-200 rounded-lg px-4 py-3 font-mono text-sm text-gray-800">
                {`(A(B(C()())(D()()))(E(F()())(G()())))`}
              </pre>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 mb-1">Output:</p>
              <pre className="bg-white border border-gray-200 rounded-lg px-4 py-3 font-mono text-sm text-gray-800">
                {`A B C D E F G`}
              </pre>
            </div>
          </div>
        </div>
      </div>

      {/* Hint */}
      <div className="mb-5">
        <button
          onClick={() => setShowHint(!showHint)}
          className="flex items-center gap-2 text-sm font-semibold text-yellow-700 bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-2.5 hover:bg-yellow-100 transition-colors w-full"
        >
          <span>{showHint ? '▾' : '▸'}</span>
          <span>Hint</span>
        </button>
        {showHint && (
          <div className="mt-2 bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-3 text-sm text-gray-700">
            <p className="mb-2">Gambarkan dulu struktur pohonnya:</p>
            <pre className="font-mono text-[13px] bg-white border border-gray-200 rounded px-3 py-2">{`        A
       / \\
      B   E
     / \\ / \\
    C  D F  G`}</pre>
            <p className="mt-2">Pre-order berarti cetak <strong>akar</strong> lebih dulu, baru rekursi ke <strong>kiri</strong>, lalu ke <strong>kanan</strong>:</p>
            <pre className="mt-1 font-mono text-[13px] bg-white border border-gray-200 rounded px-3 py-2">{`cetak(akar)
preOrder(kiri)
preOrder(kanan)`}</pre>
          </div>
        )}
      </div>

      <hr className="my-6 border-gray-200" />

      {/* Pembahasan */}
      <div>
        <button
          onClick={() => setShowJawaban(!showJawaban)}
          className="flex items-center gap-2 text-sm font-semibold text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-4 py-2.5 hover:bg-amber-100 transition-colors w-full mb-4"
        >
          <span>{showJawaban ? '▾' : '▸'}</span>
          <span>Lihat Pembahasan</span>
        </button>

        {showJawaban && (
          <div className="space-y-6">
            {/* Langkah per langkah */}
            <div>
              <h3 className="text-base font-bold text-gray-800 mb-3">Langkah demi Langkah</h3>
              <div className="space-y-3">
                {[
                  { node: 'A', step: 'Kunjungi A (akar) → cetak A. Rekursi ke kiri (B).', is_leaf: false },
                  { node: 'B', step: 'Kunjungi B → cetak B. Rekursi ke kiri (C).', is_leaf: false },
                  { node: 'C', step: 'Kunjungi C → cetak C. C adalah daun, tidak ada rekursi.', is_leaf: true },
                  { node: 'D', step: 'Kembali ke B. Rekursi ke kanan (D). Kunjungi D → cetak D. D adalah daun.', is_leaf: true },
                  { node: 'E', step: 'Kembali ke A. Rekursi ke kanan (E). Kunjungi E → cetak E.', is_leaf: false },
                  { node: 'F', step: 'Rekursi ke kiri E (F). Kunjungi F → cetak F. F adalah daun.', is_leaf: true },
                  { node: 'G', step: 'Rekursi ke kanan E (G). Kunjungi G → cetak G. G adalah daun.', is_leaf: true },
                ].map((item, i) => (
                  <div key={i} className={`border rounded-lg p-3 ${item.is_leaf ? 'border-green-200 bg-green-50' : 'border-amber-200 bg-amber-50'}`}>
                    <div className="flex items-start gap-2">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full shrink-0 mt-0.5 font-mono ${item.is_leaf ? 'bg-green-200 text-green-700' : 'bg-amber-200 text-amber-700'}`}>
                        {item.node}
                      </span>
                      <p className="text-sm text-gray-700">{item.step}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Urutan akhir */}
            <div>
              <h3 className="text-base font-bold text-gray-800 mb-2">Urutan Kunjungan</h3>
              <div className="flex flex-wrap gap-2 items-center">
                {['A', 'B', 'C', 'D', 'E', 'F', 'G'].map((node, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="w-9 h-9 rounded-full bg-amber-600 text-white text-sm font-bold flex items-center justify-center">{node}</span>
                    {i < 6 && <span className="text-gray-400 text-sm">→</span>}
                  </div>
                ))}
              </div>
              <p className="mt-3 font-mono text-sm bg-gray-50 border border-gray-200 rounded-lg px-4 py-2">
                Output: <strong>A B C D E F G</strong>
              </p>
            </div>

            {/* Implementasi C */}
            <div>
              <h3 className="text-base font-bold text-gray-800 mb-2">Implementasi Bahasa C</h3>
              <CodeBlock language="c">{`
#include <stdio.h>
#include <stdlib.h>

#define NIL NULL

typedef char ElType;
typedef struct treeNode* Address;
typedef struct treeNode {
    ElType  info;
    Address left;
    Address right;
} TreeNode;
typedef Address BinTree;

Address newTreeNode(ElType x) {
    Address p = (Address) malloc(sizeof(TreeNode));
    if (p != NIL) { p->info = x; p->left = NIL; p->right = NIL; }
    return p;
}

void BuildTreeFromString(BinTree *t, char *st, int *idx) {
    (*idx)++;
    if (st[*idx] == ')') {
        (*t) = NIL;
    } else {
        *t = newTreeNode(st[*idx]);
        (*idx)++;
        BuildTreeFromString(&((*t)->left),  st, idx);
        BuildTreeFromString(&((*t)->right), st, idx);
    }
    (*idx)++;
}

int isFirst = 1;

void printPreOrder(BinTree p) {
    if (p != NIL) {
        if (!isFirst) printf(" ");
        printf("%c", p->info);
        isFirst = 0;
        printPreOrder(p->left);
        printPreOrder(p->right);
    }
}

int main() {
    BinTree t;
    char s[201];
    int idx = 0;
    scanf("%s", s);
    BuildTreeFromString(&t, s, &idx);
    printPreOrder(t);
    printf("\\n");
    return 0;
}
              `}</CodeBlock>
            </div>

            {/* Analisis */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 text-sm text-blue-800">
              <p className="font-semibold mb-1">Analisis:</p>
              <ul className="list-disc list-inside space-y-0.5">
                <li>Pohon memiliki 7 simpul (A, B, C, D, E, F, G) dan 4 daun (C, D, F, G)</li>
                <li>Tinggi pohon = 3 (jalur terpanjang: A→B→C atau A→E→F)</li>
                <li>Pre-order selalu mengunjungi akar sebelum subtree-nya — cocok untuk menyalin struktur pohon</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Latihan helpers
// ---------------------------------------------------------------------------
const NILAI_COLOR = {
  'Sangat Baik':    'bg-green-100 text-green-700 border-green-200',
  'Baik':           'bg-blue-100 text-blue-700 border-blue-200',
  'Cukup':          'bg-yellow-100 text-yellow-700 border-yellow-200',
  'Perlu Perbaikan':'bg-red-100 text-red-700 border-red-200',
  'Belum Dijawab':  'bg-gray-100 text-gray-500 border-gray-200',
};
const SKOR_BAR = (skor) => {
  if (skor >= 85) return 'bg-green-500';
  if (skor >= 70) return 'bg-blue-500';
  if (skor >= 50) return 'bg-yellow-500';
  return 'bg-red-500';
};
function Spinner() {
  return (
    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
    </svg>
  );
}
function MetrikBar({ metrik }) {
  return (
    <div className="px-4 py-3 border-t border-gray-100 space-y-2.5">
      <div className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Rincian Penilaian</div>
      {metrik.map((m) => {
        const pct = m.maks > 0 ? (m.skor / m.maks) * 100 : 0;
        const barColor = pct >= 70 ? 'bg-green-500' : pct >= 50 ? 'bg-yellow-500' : 'bg-red-400';
        return (
          <div key={m.nama}>
            <div className="flex items-center justify-between text-xs mb-0.5">
              <span className="text-gray-600 font-medium">{m.nama}</span>
              <span className="text-gray-500 font-mono">{m.skor}/{m.maks}</span>
            </div>
            <div className="bg-gray-100 rounded-full h-1.5 mb-0.5">
              <div className={`h-1.5 rounded-full ${barColor}`} style={{ width: `${pct}%` }} />
            </div>
            {m.keterangan && <p className="text-[11px] text-gray-400 leading-tight">{m.keterangan}</p>}
          </div>
        );
      })}
    </div>
  );
}
function FeedbackBody({ fb, soal, jawaban }) {
  return (
    <div className="px-4 py-4 border-t border-gray-100 space-y-3">
      {jawaban?.trim() && (
        <div>
          <div className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">Jawabanmu</div>
          <pre className={`whitespace-pre-wrap text-sm rounded-lg px-3 py-2.5 border border-gray-200 overflow-x-auto ${soal.tipe === 'implementasi' ? 'font-mono bg-gray-900 text-green-300 text-[12px]' : 'bg-gray-50 text-gray-700 font-sans'}`}>
            {jawaban}
          </pre>
        </div>
      )}
      <p className="text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 leading-relaxed">{fb.komentar}</p>
      {fb.yang_benar && (
        <div className="bg-green-50 border border-green-200 rounded-lg px-3 py-2.5 text-sm text-green-800 leading-relaxed">
          <span className="font-semibold">✓ Yang sudah benar: </span>{fb.yang_benar}
        </div>
      )}
      {fb.yang_perlu_diperbaiki && (
        <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2.5 text-sm text-red-800 leading-relaxed">
          <span className="font-semibold">✗ Perlu diperbaiki: </span>{fb.yang_perlu_diperbaiki}
        </div>
      )}
      {fb.konsep_lemah?.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap pt-1">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Pelajari:</span>
          {fb.konsep_lemah.map((k) => (
            <span key={k} className="text-[11px] bg-orange-50 border border-orange-200 text-orange-700 px-2 py-0.5 rounded-full">{k}</span>
          ))}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// LATIHAN component
// ---------------------------------------------------------------------------
function LatihanContent({ onQuestionEvaluated }) {
  const [fase, setFase]               = useState('loading');
  const [soalList, setSoalList]       = useState([]);
  const [genError, setGenError]       = useState('');
  const [idx, setIdx]                 = useState(0);
  const [jawaban, setJawaban]         = useState({});
  const [feedbackMap, setFeedbackMap] = useState({});
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evalError, setEvalError]     = useState('');
  const [showNotasi, setShowNotasi]   = useState(false);
  const [resultIdx, setResultIdx]     = useState(0);
  const [regeneratingIdx, setRegeneratingIdx] = useState(null);

  const generateSoal = useCallback(async (kelemahan = []) => {
    setFase('loading');
    setGenError('');
    try {
      const res = await fetch('/api/latihan-binary-tree/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jumlah: 5, kelemahan }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Gagal generate soal');
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data.soal));
      setSoalList(data.soal);
      setIdx(0);
      setJawaban({});
      setFeedbackMap({});
      setShowNotasi(false);
      setFase('latihan');
    } catch (e) {
      setGenError(e.message);
      setFase('error');
    }
  }, []);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSoalList(parsed);
          setFase('latihan');
          return;
        }
      }
    } catch {}
    generateSoal([]);
  }, [generateSoal]);

  const evaluasiSoal = async () => {
    const soal = soalList[idx];
    setIsEvaluating(true);
    setEvalError('');
    try {
      const res = await fetch('/api/latihan-binary-tree/evaluasi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ soal, jawaban: jawaban[soal.id] ?? '' }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Evaluasi gagal');
      setFeedbackMap((prev) => ({ ...prev, [soal.id]: data }));
      onQuestionEvaluated?.(soal.id);
    } catch (e) {
      setEvalError(e.message);
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleLanjut = () => {
    if (idx < soalList.length - 1) {
      setIdx(idx + 1);
      setShowNotasi(false);
      setEvalError('');
    } else {
      setResultIdx(0);
      setFase('ringkasan');
    }
  };

  const handleGenerateBaru = () => {
    const kelemahan = [...new Set(Object.values(feedbackMap).flatMap((f) => f.konsep_lemah ?? []))];
    generateSoal(kelemahan);
  };

  const regenerateSoal = async (soalIdx) => {
    const target = soalList[soalIdx];
    setRegeneratingIdx(soalIdx);
    try {
      const res = await fetch('/api/latihan-binary-tree/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jumlah: 1, tipe_paksa: target.tipe, topik_referensi: target.topik }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Gagal generate soal');
      const newSoal = { ...data.soal[0], id: target.id };
      const updatedList = soalList.map((s, i) => (i === soalIdx ? newSoal : s));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
      setSoalList(updatedList);
      setJawaban((prev) => { const next = { ...prev }; delete next[target.id]; return next; });
      setFeedbackMap((prev) => { const next = { ...prev }; delete next[target.id]; return next; });
      setShowNotasi(false);
    } catch {}
    finally { setRegeneratingIdx(null); }
  };

  if (fase === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-500">
        <svg className="animate-spin w-8 h-8 mb-4 text-amber-500" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
        <p className="text-sm font-medium">Menyiapkan soal latihan...</p>
        <p className="text-xs text-gray-400 mt-1">AI sedang membuat soal untukmu</p>
      </div>
    );
  }
  if (fase === 'error') {
    return (
      <div className="py-10 text-center">
        <p className="text-red-600 text-sm mb-3">{genError}</p>
        <button onClick={() => generateSoal([])} className="px-4 py-2 bg-amber-600 text-white text-sm rounded-lg hover:bg-amber-700">Coba Lagi</button>
      </div>
    );
  }

  if (fase === 'ringkasan') {
    const allFeedbacks = soalList.map((s) => feedbackMap[s.id]).filter(Boolean);
    const avgSkor = allFeedbacks.length ? Math.round(allFeedbacks.reduce((a, f) => a + f.skor, 0) / allFeedbacks.length) : 0;
    const konsepLemah = [...new Set(allFeedbacks.flatMap((f) => f.konsep_lemah ?? []))];
    const soalLemah = soalList.filter((s) => (feedbackMap[s.id]?.skor ?? 100) < 70);
    const curSoal = soalList[resultIdx];
    const curFb = feedbackMap[curSoal?.id];
    return (
      <div className="text-[15px] text-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Hasil Latihan</h2>
            <p className="text-sm text-gray-500">Pohon Biner</p>
          </div>
        </div>
        <div className="bg-linear-to-r from-amber-600 to-amber-700 rounded-xl p-5 text-white mb-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-amber-200 text-sm font-medium">Nilai Rata-rata</p>
              <p className="text-4xl font-bold">{avgSkor}<span className="text-xl text-amber-300">/100</span></p>
            </div>
            <div className="text-right">
              <p className="text-amber-200 text-sm">Soal dievaluasi</p>
              <p className="text-2xl font-bold">{allFeedbacks.length}/{soalList.length}</p>
            </div>
          </div>
          <div className="mt-3 bg-amber-500 rounded-full h-2">
            <div className="bg-white h-2 rounded-full" style={{ width: `${avgSkor}%` }} />
          </div>
        </div>
        <div className="flex items-center gap-2 mb-5">
          {soalList.map((sq, i) => {
            const f = feedbackMap[sq.id];
            let cls = 'border-2 ';
            if (f) cls += f.skor >= 70 ? 'bg-green-500 border-green-500 text-white' : 'bg-red-400 border-red-400 text-white';
            else cls += i === resultIdx ? 'bg-white border-amber-600 text-amber-600' : 'bg-gray-100 border-gray-300 text-gray-400';
            return (
              <button key={sq.id} onClick={() => setResultIdx(i)} className={`w-8 h-8 rounded-full text-xs font-bold transition-all ${cls}`}>{sq.id}</button>
            );
          })}
        </div>
        {curSoal && curFb && (
          <div className="border border-gray-200 rounded-xl overflow-hidden mb-4">
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-amber-600 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">{curSoal.id}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${curSoal.tipe === 'implementasi' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-indigo-50 text-indigo-700 border-indigo-200'}`}>
                    {curSoal.tipe === 'implementasi' ? 'Implementasi' : 'Pengetahuan'}
                  </span>
                  {curSoal.topik.map((t) => (
                    <span key={t} className="text-[11px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">{t}</span>
                  ))}
                </div>
                <p className="text-sm text-gray-800 font-medium whitespace-pre-line">{curSoal.pertanyaan}</p>
              </div>
              <button
                onClick={async () => { await regenerateSoal(resultIdx); setIdx(resultIdx); setFase('latihan'); }}
                disabled={regeneratingIdx !== null}
                className="shrink-0 flex items-center gap-1.5 text-[11px] font-medium text-gray-400 hover:text-amber-600 hover:bg-amber-50 border border-gray-200 hover:border-amber-200 rounded-lg px-2.5 py-1.5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed mt-0.5"
              >
                {regeneratingIdx === resultIdx ? <><Spinner /> Generating...</> : <>↻ Ganti Soal</>}
              </button>
            </div>
            <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-3">
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${NILAI_COLOR[curFb.nilai] ?? NILAI_COLOR['Cukup']}`}>{curFb.nilai}</span>
              <span className="text-sm font-semibold text-gray-700">{curFb.skor}/100</span>
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div className={`h-2 rounded-full ${SKOR_BAR(curFb.skor)}`} style={{ width: `${curFb.skor}%` }} />
              </div>
            </div>
            {curFb.metrik?.length > 0 && <MetrikBar metrik={curFb.metrik} />}
            <FeedbackBody fb={curFb} soal={curSoal} jawaban={jawaban[curSoal.id]} />
          </div>
        )}
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => setResultIdx(Math.max(0, resultIdx - 1))} disabled={resultIdx === 0} className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">← Sebelumnya</button>
          <span className="text-sm text-gray-400">Soal {resultIdx + 1} dari {soalList.length}</span>
          <button onClick={() => setResultIdx(Math.min(soalList.length - 1, resultIdx + 1))} disabled={resultIdx === soalList.length - 1} className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">Berikutnya →</button>
        </div>
        {konsepLemah.length > 0 && (
          <div className="border border-orange-200 rounded-xl overflow-hidden mb-4">
            <div className="bg-orange-50 px-4 py-2.5 border-b border-orange-200">
              <span className="text-orange-700 font-bold text-sm">Analisis Kelemahan</span>
            </div>
            <div className="px-4 py-3">
              {soalLemah.length > 0 && (
                <p className="text-sm text-gray-700 mb-3">{soalLemah.length} soal dengan skor di bawah 70 ({soalLemah.map((s) => `Soal ${s.id}`).join(', ')}). Fokus belajar di:</p>
              )}
              <div className="flex flex-wrap gap-2">
                {konsepLemah.map((k) => (
                  <span key={k} className="text-[11px] bg-orange-50 border border-orange-300 text-orange-700 px-2.5 py-1 rounded-full font-medium">{k}</span>
                ))}
              </div>
            </div>
          </div>
        )}
        <div className="border border-amber-200 rounded-xl p-4 text-center bg-amber-50">
          <p className="text-sm font-semibold text-amber-800 mb-1">
            {konsepLemah.length > 0 ? 'Latihan soal baru untuk perkuat kelemahanmu' : 'Kerjakan soal latihan baru'}
          </p>
          <p className="text-xs text-amber-600 mb-3">
            {konsepLemah.length > 0
              ? `AI akan fokus pada: ${konsepLemah.slice(0, 3).join(', ')}${konsepLemah.length > 3 ? '...' : ''}`
              : 'AI akan membuat soal baru dengan tingkat kesulitan serupa'}
          </p>
          <button onClick={handleGenerateBaru} className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold rounded-lg transition-colors">
            Generate Soal Baru
          </button>
        </div>
      </div>
    );
  }

  if (!soalList.length) return null;
  const soal = soalList[idx];
  const currentJawaban = jawaban[soal.id] ?? '';
  const currentFeedback = feedbackMap[soal.id];
  const isLast = idx === soalList.length - 1;
  const totalEvaluated = soalList.filter((s) => feedbackMap[s.id]).length;

  return (
    <div className="text-[15px] text-gray-700">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-gray-900">Soal Latihan</h2>
        <p className="text-sm text-gray-500 mt-0.5">Pohon Biner</p>
      </div>
      <div className="flex items-center gap-2 mb-5">
        {soalList.map((sq, i) => {
          const f = feedbackMap[sq.id];
          const isCur = i === idx;
          let cls = 'border-2 ';
          if (f) cls += f.skor >= 70 ? 'bg-green-500 border-green-500 text-white' : 'bg-red-400 border-red-400 text-white';
          else if (isCur) cls += jawaban[sq.id]?.trim() ? 'bg-amber-600 border-amber-600 text-white' : 'bg-white border-amber-600 text-amber-600';
          else cls += jawaban[sq.id]?.trim() ? 'bg-amber-100 border-amber-400 text-amber-700' : 'bg-gray-100 border-gray-300 text-gray-400';
          return (
            <button key={sq.id} onClick={() => { setIdx(i); setShowNotasi(false); setEvalError(''); }} className={`w-8 h-8 rounded-full text-xs font-bold transition-all ${cls}`}>
              {f ? sq.id : jawaban[sq.id]?.trim() ? '✓' : sq.id}
            </button>
          );
        })}
        <span className="ml-2 text-xs text-gray-400">{totalEvaluated}/{soalList.length} dinilai</span>
      </div>

      <div className="border border-gray-200 rounded-xl overflow-hidden">
        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-start gap-3">
          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${currentFeedback ? (currentFeedback.skor >= 70 ? 'bg-green-500 text-white' : 'bg-red-400 text-white') : currentJawaban.trim() ? 'bg-amber-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
            {currentJawaban.trim() && !currentFeedback ? '✓' : soal.id}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1.5">
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${soal.tipe === 'implementasi' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-indigo-50 text-indigo-700 border-indigo-200'}`}>
                {soal.tipe === 'implementasi' ? 'Implementasi' : 'Pengetahuan'}
              </span>
              {soal.topik.map((t) => (
                <span key={t} className="text-[11px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">{t}</span>
              ))}
            </div>
            <p className="text-sm text-gray-800 font-medium leading-relaxed whitespace-pre-line">{soal.pertanyaan}</p>
          </div>
          <button
            onClick={() => regenerateSoal(idx)}
            disabled={regeneratingIdx !== null || isEvaluating}
            className="shrink-0 flex items-center gap-1.5 text-[11px] font-medium text-gray-400 hover:text-amber-600 hover:bg-amber-50 border border-gray-200 hover:border-amber-200 rounded-lg px-2.5 py-1.5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed mt-0.5"
          >
            {regeneratingIdx === idx ? <><Spinner /> Generating...</> : <>↻ Ganti Soal</>}
          </button>
        </div>

        {soal.notasiAlgoritma && (
          <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-200">
            <button onClick={() => setShowNotasi((v) => !v)} className="text-xs text-amber-600 hover:underline font-medium flex items-center gap-1">
              <span>{showNotasi ? '▾' : '▸'}</span>
              <span>Notasi Algoritma (referensi)</span>
            </button>
            {showNotasi && (
              <pre className="mt-2 bg-white border border-gray-200 rounded-lg px-4 py-3 text-[12px] font-mono text-gray-700 overflow-x-auto leading-relaxed">{soal.notasiAlgoritma}</pre>
            )}
          </div>
        )}

        {!currentFeedback && (
          <div className="px-4 py-3">
            <textarea
              key={soal.id}
              value={currentJawaban}
              onChange={(e) => setJawaban((prev) => ({ ...prev, [soal.id]: e.target.value }))}
              placeholder={soal.tipe === 'implementasi' ? '// Tulis notasi algoritmik atau kode C kamu di sini...' : 'Tulis jawabanmu di sini...'}
              rows={soal.tipe === 'implementasi' ? 12 : 6}
              className={`w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent resize-y transition ${soal.tipe === 'implementasi' ? 'font-mono bg-gray-900 text-green-300' : 'bg-white text-gray-700'}`}
              spellCheck={false}
            />
          </div>
        )}

        {currentFeedback && (
          <>
            <div className="px-4 py-3 border-t border-gray-100 flex items-center gap-3">
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${NILAI_COLOR[currentFeedback.nilai] ?? NILAI_COLOR['Cukup']}`}>{currentFeedback.nilai}</span>
              <span className="text-sm font-semibold text-gray-700">{currentFeedback.skor}/100</span>
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div className={`h-2 rounded-full ${SKOR_BAR(currentFeedback.skor)}`} style={{ width: `${currentFeedback.skor}%` }} />
              </div>
            </div>
            {currentFeedback.metrik?.length > 0 && <MetrikBar metrik={currentFeedback.metrik} />}
            <FeedbackBody fb={currentFeedback} soal={soal} jawaban={jawaban[soal.id]} />
          </>
        )}
      </div>

      {evalError && (
        <div className="mt-3 bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700">
          <span className="font-semibold">Error: </span>{evalError}
        </div>
      )}

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
        <button onClick={() => { setIdx(Math.max(0, idx - 1)); setShowNotasi(false); setEvalError(''); }} disabled={idx === 0} className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors min-h-10">
          ← Sebelumnya
        </button>
        <span className="text-sm text-gray-400 shrink-0 order-last sm:order-0 w-full sm:w-auto text-center">Soal {idx + 1} dari {soalList.length}</span>
        <div className="flex items-center gap-2">
          {!currentFeedback ? (
            <button onClick={evaluasiSoal} disabled={isEvaluating || !currentJawaban.trim()} className="flex items-center gap-2 px-5 py-2.5 bg-amber-600 hover:bg-amber-700 active:bg-amber-800 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg transition-colors min-h-10">
              {isEvaluating ? <><Spinner /> Menilai...</> : 'Nilai Soal Ini'}
            </button>
          ) : (
            <button onClick={handleLanjut} className="flex items-center gap-1.5 px-5 py-2.5 bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white text-sm font-semibold rounded-lg transition-colors min-h-10">
              {isLast ? 'Lihat Hasil' : 'Soal Berikutnya →'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// RINGKASAN content
// ---------------------------------------------------------------------------
function RingkasanContent() {
  return (
    <div className="text-[15px] text-gray-700">
      <div className="mb-5">
        <h2 className="text-xl font-bold text-gray-900">Ringkasan — Pohon Biner</h2>
        <p className="text-sm text-gray-400 mt-0.5">ADT, Traversal, Fungsi Rekursif, BST</p>
      </div>

      <div className="grid grid-cols-1 gap-4 mb-6">
        {/* 1 — ADT */}
        <div className="border border-amber-100 rounded-xl overflow-hidden">
          <div className="bg-amber-600 px-4 py-2.5 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-white text-amber-600 text-xs font-bold flex items-center justify-center shrink-0">1</span>
            <span className="text-white font-bold text-sm">ADT Pohon Biner</span>
          </div>
          <div className="px-4 py-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[13px]">
              <div className="bg-amber-50 border border-amber-100 text-amber-800 rounded-lg px-3 py-2">
                <div className="font-bold mb-1">Struktur</div>
                <code className="text-[12px] font-mono leading-relaxed block">{`BinTree = Address
TreeNode:
  info  : ElType
  left  : BinTree
  right : BinTree
Kosong = NIL`}</code>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
                <div className="font-bold mb-1 text-gray-700">Predikat</div>
                <code className="text-[11px] font-mono text-gray-600 leading-relaxed block">{`isTreeEmpty   → p=NIL
isOneElmt     → daun
isUnerLeft    → hanya kiri
isUnerRight   → hanya kanan
isBiner       → kiri+kanan`}</code>
              </div>
            </div>
          </div>
        </div>

        {/* 2 — Traversal */}
        <div className="border border-blue-100 rounded-xl overflow-hidden">
          <div className="bg-blue-600 px-4 py-2.5 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-white text-blue-600 text-xs font-bold flex items-center justify-center shrink-0">2</span>
            <span className="text-white font-bold text-sm">Tiga Traversal</span>
          </div>
          <div className="px-4 py-3">
            <div className="grid grid-cols-1 gap-2 text-[13px]">
              {[
                { name: 'Pre-order',  urutan: 'Akar → Kiri → Kanan', hasil: 'A B C D E F G', color: 'bg-blue-50 border-blue-100 text-blue-800',   use: 'Copy pohon, prefix expression' },
                { name: 'In-order',   urutan: 'Kiri → Akar → Kanan', hasil: 'C B D A F E G', color: 'bg-green-50 border-green-100 text-green-800', use: 'Urutan terurut pada BST' },
                { name: 'Post-order', urutan: 'Kiri → Kanan → Akar', hasil: 'C D B F G E A', color: 'bg-purple-50 border-purple-100 text-purple-800', use: 'Hapus pohon, postfix expression' },
              ].map((t) => (
                <div key={t.name} className={`border rounded-lg px-3 py-2 ${t.color}`}>
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div>
                      <span className="font-bold">{t.name}</span>
                      <span className="ml-2 text-[12px] opacity-70">{t.urutan}</span>
                    </div>
                    <code className="font-mono text-[11px]">{t.hasil}</code>
                  </div>
                  <div className="text-[11px] mt-0.5 opacity-70">{t.use}</div>
                </div>
              ))}
            </div>
            <p className="text-[11px] text-gray-400 mt-2">* Pohon contoh: A akar, B(C,D) kiri, E(F,G) kanan</p>
          </div>
        </div>

        {/* 3 — Fungsi rekursif */}
        <div className="border border-orange-100 rounded-xl overflow-hidden">
          <div className="bg-orange-600 px-4 py-2.5 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-white text-orange-600 text-xs font-bold flex items-center justify-center shrink-0">3</span>
            <span className="text-white font-bold text-sm">Fungsi-fungsi Rekursif</span>
          </div>
          <div className="px-4 py-3">
            <div className="grid grid-cols-1 gap-2 text-[13px]">
              {[
                { fn: 'nbElmt(p)', basis: 'kosong → 0', rekurens: '1 + nbElmt(left) + nbElmt(right)', color: 'bg-orange-50 border-orange-100 text-orange-800' },
                { fn: 'depth(p)',  basis: 'kosong → 0', rekurens: '1 + max(depth(left), depth(right))', color: 'bg-yellow-50 border-yellow-100 text-yellow-800' },
                { fn: 'nbLeaf(p)', basis: 'kosong → 0\ndaun → 1', rekurens: 'nbLeaf(left) + nbLeaf(right)', color: 'bg-lime-50 border-lime-100 text-lime-800' },
              ].map((f) => (
                <div key={f.fn} className={`border rounded-lg px-3 py-2 ${f.color}`}>
                  <code className="font-bold font-mono text-[13px]">{f.fn}</code>
                  <div className="mt-1 grid grid-cols-2 gap-2 text-[11px]">
                    <div><span className="opacity-60">Basis: </span><code className="font-mono whitespace-pre">{f.basis}</code></div>
                    <div><span className="opacity-60">Rekurens: </span><code className="font-mono">{f.rekurens}</code></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 4 — BST */}
        <div className="border border-red-100 rounded-xl overflow-hidden">
          <div className="bg-red-600 px-4 py-2.5 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-white text-red-600 text-xs font-bold flex items-center justify-center shrink-0">4</span>
            <span className="text-white font-bold text-sm">Binary Search Tree (BST)</span>
          </div>
          <div className="px-4 py-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[13px]">
              <div className="bg-red-50 border border-red-100 text-red-800 rounded-lg px-3 py-2">
                <div className="font-bold mb-1">Property</div>
                <code className="text-[12px] font-mono leading-relaxed block">{`kiri < akar ≤ kanan
In-order = urutan naik`}</code>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
                <div className="font-bold mb-1 text-gray-700">Insert (insSearchTree)</div>
                <code className="text-[11px] font-mono text-gray-600 leading-relaxed block">{`kosong → buat node
key=same → count++
key<akar → rekursi kiri
key>akar → rekursi kanan`}</code>
              </div>
            </div>
            <div className="mt-2 grid grid-cols-2 gap-2 text-[12px]">
              <div className="bg-yellow-50 border border-yellow-100 rounded-lg px-3 py-2">
                <div className="font-bold text-yellow-700 mb-0.5">Delete — 4 Kasus</div>
                <code className="font-mono text-yellow-800 text-[11px] leading-relaxed block">{`isOneElmt → NIL
isUnerLeft → ambil kiri
isUnerRight → ambil kanan
isBiner → delNode`}</code>
              </div>
              <div className="bg-blue-50 border border-blue-100 rounded-lg px-3 py-2">
                <div className="font-bold text-blue-700 mb-0.5">delNode</div>
                <div className="text-blue-700 text-[11px]">Cari daun terkanan subpohon kiri, salin nilainya ke node yang dihapus, hapus daun tersebut.</div>
              </div>
            </div>
          </div>
        </div>

        {/* 5 — Pita karakter */}
        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <div className="bg-gray-800 px-4 py-2.5 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-white text-gray-800 text-xs font-bold flex items-center justify-center shrink-0">5</span>
            <span className="text-white font-bold text-sm">Format Pita Karakter</span>
          </div>
          <div className="px-4 py-3">
            <div className="grid grid-cols-1 gap-2 text-[13px]">
              <pre className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 font-mono text-gray-800 text-[12px]">{`Format: (akar(left)(right))
Kosong: ()
Contoh: (A(B()())(C()())) → A dengan anak B dan C`}</pre>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
                  <div className="font-bold text-gray-700 mb-0.5">BuildTreeFromString</div>
                  <div className="text-[11px] text-gray-600">Gunakan indeks (*idx) untuk melacak posisi karakter dalam string.</div>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
                  <div className="font-bold text-gray-700 mb-0.5">Pola rekursif</div>
                  <div className="text-[11px] text-gray-600">Lewati (, baca akar, rekursi ke kiri, rekursi ke kanan, lewati ).</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick ref */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
        <p className="text-sm font-bold text-amber-800 mb-2">Basis-0 vs Basis-1</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[12px]">
          <div>
            <div className="text-[11px] font-bold text-amber-600 uppercase tracking-widest mb-1">Basis-0 (isTreeEmpty)</div>
            <pre className="bg-white border border-amber-100 rounded-lg px-3 py-2 font-mono text-gray-800 leading-relaxed">{`if isTreeEmpty(p) then
    → nilai_basis
else
    { rekursi ke kiri/kanan }`}</pre>
          </div>
          <div>
            <div className="text-[11px] font-bold text-indigo-600 uppercase tracking-widest mb-1">Basis-1 (isOneElmt)</div>
            <pre className="bg-white border border-indigo-100 rounded-lg px-3 py-2 font-mono text-gray-800 leading-relaxed">{`if isOneElmt(p) then
    → nilai_basis
else
    depend on p
        isUnerLeft : ...
        isUnerRight: ...
        isBiner    : ...`}</pre>
          </div>
        </div>
      </div>

      <div className="border border-gray-200 rounded-xl p-4 bg-gray-50">
        <p className="text-sm font-bold text-gray-700 mb-3">Hal-hal yang Perlu Diingat</p>
        <div className="grid grid-cols-1 gap-2 text-[13px]">
          {[
            { tip: 'Traversal In-order pada BST', detail: 'Selalu menghasilkan urutan terurut naik karena property kiri < akar ≤ kanan.', color: 'bg-blue-50 border-blue-100 text-blue-800' },
            { tip: 'delNode pada BST delete', detail: 'Node pengganti adalah daun terkanan subpohon kiri (in-order predecessor) — lebih kecil dari semua node kanan.', color: 'bg-red-50 border-red-100 text-red-800' },
            { tip: 'nbLeaf memerlukan nbLeaf1', detail: 'nbLeaf menangani pohon kosong, lalu memanggil nbLeaf1 yang menggunakan basis-1 karena dijamin tidak kosong.', color: 'bg-amber-50 border-amber-100 text-amber-800' },
            { tip: 'depth = tinggi pohon', detail: 'Pohon kosong → 0. Pohon satu simpul → 1. Selalu 1 + max(depth(kiri), depth(kanan)).', color: 'bg-green-50 border-green-100 text-green-800' },
          ].map((item) => (
            <div key={item.tip} className={`border rounded-lg px-3 py-2 ${item.color}`}>
              <div className="font-bold mb-0.5">{item.tip}</div>
              <div className="text-[12px] opacity-80">{item.detail}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Page
// ---------------------------------------------------------------------------
export default function BinaryTreePage() {
  const [activeTab, setActiveTab] = useState('MATERI');
  const [activeSection, setActiveSection] = useState('pengantar');
  const [showToc, setShowToc] = useState(false);
  const [completed, setCompleted] = useState({ materi: false, contoh: false, latihan: false, ringkasan: false });

  useEffect(() => {
    fetchTopicProgress('binary-tree').then((prog) => {
      if (prog) setCompleted({ materi: !!prog.materi, contoh: !!prog.contoh, latihan: !!prog.latihan, ringkasan: !!prog.ringkasan });
    });
  }, []);
  const mainRef = useRef(null);

  const handleTabClick = (tab) => { setActiveTab(tab); setShowToc(false); };

  const handleComplete = (tab) => {
    const key = TAB_KEYS[tab];
    if (!key || completed[key]) return;
    const next = { ...completed, [key]: true };
    setCompleted(next);
    saveTopicProgress('binary-tree', next);
  };

  const handleQuestionEvaluated = useCallback((questionId) => {
    try {
      const evaluated = new Set(JSON.parse(localStorage.getItem('asd_evaluated_binary_tree') ?? '[]'));
      evaluated.add(questionId);
      localStorage.setItem('asd_evaluated_binary_tree', JSON.stringify([...evaluated]));
    } catch {}
  }, []);

  useEffect(() => {
    const main = mainRef.current;
    if (!main) return;
    const handleScroll = () => {
      const scrollY = main.scrollTop + 120;
      let current = 'pengantar';
      for (const s of SECTIONS) {
        const el = document.getElementById(s.id);
        if (el && el.offsetTop <= scrollY) current = s.id;
      }
      setActiveSection(current);
    };
    main.addEventListener('scroll', handleScroll, { passive: true });
    return () => main.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    setActiveSection(id);
    const el = document.getElementById(id);
    const main = mainRef.current;
    if (el && main) main.scrollTo({ top: el.offsetTop - 110, behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col lg:flex-row overflow-hidden" style={{ height: 'calc(100vh - 56px)' }}>
      {/* Sidebar (desktop only) */}
      <aside className="hidden lg:block w-56 shrink-0 bg-white border-r border-gray-200 overflow-y-auto">
        <div className="py-3">
          <div className="px-4 py-2 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Pohon Biner</div>
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              onClick={() => scrollToSection(s.id)}
              className={`w-full text-left text-[13px] px-4 py-1.5 transition-colors ${s.level === 1 ? 'pl-7' : ''} ${activeSection === s.id ? 'bg-amber-50 text-amber-700 font-semibold border-r-2 border-amber-600' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
            >
              {s.title}
            </button>
          ))}
        </div>
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0 bg-white overflow-hidden">
        {/* Back navigation */}
        <div className="shrink-0 px-4 sm:px-6 pt-3 pb-2">
          <Link
            href="/dashboard/topik"
            className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-gray-800 font-medium transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Topik
          </Link>
        </div>
        {/* Tabs */}
        <div className="shrink-0 border-b border-gray-200 bg-white overflow-x-auto">
          <div className="flex gap-1 px-3 sm:px-6 pt-3 min-w-max">
            {TABS.map((tab) => {
              const isDone = completed[TAB_KEYS[tab]];
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => handleTabClick(tab)}
                  className={`shrink-0 px-4 sm:px-6 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold rounded-t-lg transition-colors flex items-center gap-1.5 ${isActive ? 'bg-amber-700 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                >
                  {tab}
                  {isDone && (
                    <svg className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isActive ? 'text-green-300' : 'text-green-500'}`} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Mobile TOC toggle */}
        {activeTab === 'MATERI' && (
          <div className="lg:hidden shrink-0 bg-gray-50 border-b border-gray-200">
            <button onClick={() => setShowToc((v) => !v)} className="w-full flex items-center justify-between px-4 py-2.5 text-sm font-medium text-gray-700 active:bg-gray-100">
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h10" />
                </svg>
                Daftar Isi
              </span>
              <svg className={`w-4 h-4 text-gray-400 transition-transform ${showToc ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {showToc && (
              <div className="max-h-52 overflow-y-auto border-t border-gray-100 bg-white">
                {SECTIONS.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => { scrollToSection(s.id); setShowToc(false); }}
                    className={`w-full text-left text-[13px] px-4 py-2 transition-colors ${s.level === 1 ? 'pl-8' : ''} ${activeSection === s.id ? 'bg-amber-50 text-amber-700 font-semibold' : 'text-gray-600 hover:bg-gray-50'}`}
                  >
                    {s.title}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Scrollable content */}
        <div ref={mainRef} className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto px-4 sm:px-8 py-5 sm:py-6">
            {activeTab === 'MATERI'    && <MateriContent />}
            {activeTab === 'CONTOH'   && <ContohContent />}
            {activeTab === 'LATIHAN'  && <LatihanContent onQuestionEvaluated={handleQuestionEvaluated} />}
            {activeTab === 'RINGKASAN' && <RingkasanContent />}

            <div className="mt-10 pt-6 border-t border-gray-200 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-0 justify-between">
              <p className="text-sm text-gray-400">{Object.values(completed).filter(Boolean).length} dari 4 sesi diselesaikan</p>
              {completed[TAB_KEYS[activeTab]] ? (
                <div className="flex items-center gap-2 text-green-600 text-sm font-semibold">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  sesi ini telah diselesaikan
                </div>
              ) : (
                <button onClick={() => handleComplete(activeTab)} className="w-full sm:w-auto px-5 py-2.5 sm:py-2 bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white text-sm font-semibold rounded-lg transition-colors">
                  Tandai Selesai
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
