"""A 'magical' sorting function: no decision branching, no limits.

Resolution of the puzzle: the quintic theorem does NOT forbid branch-free
sorting.  It forbids something that masquerades as sorting.

  (A) SORTING FROM THE VALUES.  Input: the tuple (x1,...,xn) itself.
      This is a pure SELECTION problem, and it has a closed-form,
      branch-free, limit-free solution for EVERY n:

          min(a,b) = (a + b - sqrt((a-b)^2))/2
          max(a,b) = (a + b + sqrt((a-b)^2))/2

      composed along a sorting network.  Verified below for n = 5.
      No conflict with Abel-Ruffini: over the field Q(x1,...,xn) every
      sqrt((E)^2) = |E| is just +/-E -- an element ALREADY in the field.
      The formula never extends the field; it only selects.

  (B) SORTING FROM THE SYMMETRIC DATA.  Input: only e1,...,en (the
      coefficients -- equivalently, the multiset with its labels erased).
      Producing the sorted tuple from these means FIRST reconstructing
      the values (solving the degree-n polynomial) and THEN selecting.
      The selection step is still free (that is what our quartic work
      showed); the RECONSTRUCTION step is the entire content of
      Abel-Ruffini, and at n = 5 it is impossible in radicals -- hence
      impossible in radicals + |.|, since |.| adds no numbers.

  The order statistics x_(1) <= ... <= x_(n) are symmetric functions of
  the inputs, so as FUNCTIONS they factor through the coefficients: the
  map (e1..e5) -> sorted roots EXISTS and is even continuous.  It just
  is not expressible by radicals/abs/elementary functions/quadratures
  (Abel-Ruffini, Arnold, Khovanskii).  Existence was never the issue;
  expressibility in your chosen gadget set is.

  n <= 4 is precisely the regime where BOTH problems are solvable in
  closed form (radicals + |.| + arccos) -- see quartic_absolute_form.py.
  n = 5 is where problem (B) dies while problem (A) lives on untouched.
"""

import itertools

import sympy as sp


def hr(title):
    print("\n" + "=" * 72)
    print(title)
    print("=" * 72)


def bmin(a, b):
    return (a + b - sp.sqrt((a - b)**2))/2


def bmax(a, b):
    return (a + b + sp.sqrt((a - b)**2))/2


# Knuth's optimal 9-comparator sorting network for 5 elements.
NETWORK5 = [(0, 1), (3, 4), (2, 4), (2, 3), (0, 3),
            (0, 2), (1, 4), (1, 3), (1, 2)]


def branchfree_sort(values, network):
    v = list(values)
    for i, j in network:
        v[i], v[j] = bmin(v[i], v[j]), bmax(v[i], v[j])
    return v


# ----------------------------------------------------------------------
hr("0. The network is a correct sorter (zero-one principle: all 2^5 inputs)")

for bits in itertools.product((0, 1), repeat=5):
    out = branchfree_sort([sp.Integer(b) for b in bits], NETWORK5)
    assert out == sorted(bits), (bits, out)
print("all 32 binary inputs sorted correctly => sorts every input"
      " (0-1 principle)")

# ----------------------------------------------------------------------
hr("1. Problem (A): branch-free sort of five VALUES -- exists, verified")

base = (-7, -1, 0, 2, 9)
for perm in itertools.permutations(base):
    out = branchfree_sort([sp.Integer(v) for v in perm], NETWORK5)
    assert out == sorted(base), (perm, out)
print(f"all 120 orderings of {base}: output = sorted tuple  [verified]")

ties = (1, 1, 3, 3, 2)
for perm in set(itertools.permutations(ties)):
    out = branchfree_sort([sp.Integer(v) for v in perm], NETWORK5)
    assert out == sorted(ties), (perm, out)
print(f"all orderings of {ties} (ties): still exact       [verified]")

# The whole sorter is ONE closed-form expression per output slot --
# arithmetic and sqrt only, no comparisons, no limits:
a, b, c = sp.symbols("a b c", real=True)
med3 = branchfree_sort([a, b, c], [(0, 1), (1, 2), (0, 1)])[1]
print("\nmedian(a, b, c) as a single branch-free formula:")
sp.pprint(med3)
assert all(med3.subs(dict(zip((a, b, c), p))) == 2
           for p in itertools.permutations((1, 2, 7)))

xs = sp.symbols("x1:6", real=True)
sorted5 = branchfree_sort(list(xs), NETWORK5)
sizes = [sp.count_ops(e) for e in sorted5]
print(f"\nfor n = 5: five closed-form expressions, op counts {sizes}")
print("(big, but a formula: +, -, *, /, sqrt of squares -- nothing else).")

# Why no clash with Galois theory: the formula never leaves the field.
E = xs[0] - xs[3]
print("\nevery radical in it is sqrt(E^2) =", sp.sqrt(sp.factor(E**2)),
      " = +/-E:")
print("over Q(x1..x5) that is a root of the REDUCIBLE (X-E)(X+E) --")
print("degree-1 data.  Selection, not field extension.")

# ----------------------------------------------------------------------
hr("2. Problem (B): the same outputs, but from the COEFFICIENTS only")

print("""The k-th sorted output above is a SYMMETRIC function of x1..x5
(invariant under all 120 relabelings -- exactly what section 1 verified).
So as a function it factors through e1..e5: 'sorted roots from
coefficients' is a well-defined, continuous function.  But expressing it:

  n = 2:  (e1 -/+ sqrt(e1^2 - 4 e2))/2 = (min, max).      radicals+|.|: YES
  n = 3, 4:  radicals + |.| + one arccos layer            (casus irr.): YES
             -- built and verified in quartic_absolute_form.py.
  n = 5:  would require extracting the roots from a degree-120
          S5 extension.  Abel-Ruffini/Galois: NO in radicals; |.| adds
          no numbers; Arnold/Khovanskii: NO even with arbitrary
          single-valued continuous functions, elementary functions,
          or quadratures.  (Concrete witness with all roots real:
          x^5 - 5x^3 + 4x - 1, Galois group S5 --
          see quintic_abs_obstruction.py.)

So the degree-5 theorem was never about sorting.  It is about
UN-SYMMETRIZING: recovering the individual values after the labels have
been erased into symmetric functions.  Your sorting-network formula
side-steps nothing -- it simply lives on the easy side of the divide,
where the values are already in hand.""")

# ----------------------------------------------------------------------
hr("3. Where the non-analyticity intuition lands")

print("""The |.| gadget IS load-bearing -- just for a smaller theorem than
Abel-Ruffini.  Sorting cannot be done by ANALYTIC branch-free formulas:
already max(a, b) fails to be differentiable on the tie line a = b, so
no expression in +, -, *, /, exp, sin, ... (all analytic) can equal it.
The minimal non-smoothness you must buy is exactly one kink -- |.| --
and that purchase is enough for ALL of sorting, at every n.

Two theorems, two prices:
  branch-free sorting of values     costs: analyticity      (|.| pays it)
  closed-form roots from            costs: solvable Galois   (nothing in
    coefficients, n >= 5                   group             the |.| aisle
                                                             can pay it)""")
