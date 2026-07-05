"""How Ferrari's radical formula for the quartic handles the ambiguity of
unordered roots.

Setup: the monic quartic  x^4 - e1*x^3 + e2*x^2 - e3*x + e4  whose
coefficients are the elementary symmetric polynomials of real roots
r1, r2, r3, r4 with the ordering left unspecified.

Key point: the coefficients e1..e4 are *symmetric* in the roots, so the
formula's input is identical for every labeling. The formula therefore
cannot output "r1" -- it outputs an unordered 4-element set, and every
branch choice inside the radicals (sign of sqrt(discriminant), which cube
root, signs of the final square roots) corresponds to a layer of the
Galois chain  S4 > A4 > V > 1.

Sections:
  1. Euler's form of Ferrari's solution and the resolvent cubic.
  2. The product constraint that prunes 8 sign choices to 4 roots.
  3. The S4 action on the radical ingredients (the ambiguity, explicitly).
  4. sqrt(discriminant): the parity (A4) layer.
  5. Numeric demo: two labelings, byte-identical formula output.
  6. Choosing an ordering resolves the radicals.
"""

import itertools

import sympy as sp
from sympy.polys.polyroots import roots_quartic

x, z = sp.symbols("x z")
r1, r2, r3, r4 = R = sp.symbols("r1 r2 r3 r4", real=True)

e1 = r1 + r2 + r3 + r4
e2 = r1*r2 + r1*r3 + r1*r4 + r2*r3 + r2*r4 + r3*r4
e3 = r1*r2*r3 + r1*r2*r4 + r1*r3*r4 + r2*r3*r4
e4 = r1*r2*r3*r4
quartic = x**4 - e1*x**3 + e2*x**2 - e3*x + e4


def is_zero(expr):
    return sp.expand(expr) == 0


def hr(title):
    print("\n" + "=" * 72)
    print(title)
    print("=" * 72)


# ----------------------------------------------------------------------
hr("1. Euler/Ferrari structure: resolvent cubic and the three square roots")

# The three "pair sums" -- each is invariant only under the Klein
# four-group V = {e, (12)(34), (13)(24), (14)(23)} and sign-flips under
# other permutations:
s1 = r1 + r2 - r3 - r4          # pairing {12|34}
s2 = r1 - r2 + r3 - r4          # pairing {13|24}
s3 = r1 - r2 - r3 + r4          # pairing {14|23}
S = (s1, s2, s3)

# Their squares ARE symmetric under V, and the three of them are permuted
# by S4/V ~= S3.  They are (up to an affine shift) the roots of the
# resolvent cubic, whose coefficients are honest polynomials in e1..e4:
y1 = r1*r2 + r3*r4
y2 = r1*r3 + r2*r4
y3 = r1*r4 + r2*r3
resolvent = z**3 - e2*z**2 + (e1*e3 - 4*e4)*z - (e1**2*e4 - 4*e2*e4 + e3**2)

assert is_zero(sp.expand((z - y1)*(z - y2)*(z - y3)) - resolvent)
print("resolvent cubic  R(z) = z^3 - e2 z^2 + (e1 e3 - 4 e4) z -"
      " (e1^2 e4 - 4 e2 e4 + e3^2)")
print("its roots are the three pairings:")
print("  y1 = r1 r2 + r3 r4   (pairing {12|34})")
print("  y2 = r1 r3 + r2 r4   (pairing {13|24})")
print("  y3 = r1 r4 + r2 r3   (pairing {14|23})   [verified]")

for sk, yk in zip(S, (y1, y2, y3)):
    assert is_zero(sk**2 - (e1**2 - 4*e2 + 4*yk))
print("and  s_k^2 = e1^2 - 4 e2 + 4 y_k  for each k  [verified]")
print("=> the formula reaches s_k only as  sqrt(s_k^2):  the sign of each")
print("   s_k is invisible to it.")

# ----------------------------------------------------------------------
hr("2. Reassembly: 2^3 = 8 sign choices, pruned to 4 by a product constraint")

# The four roots are recovered from e1 and the three square roots:
signs_ok = [(1, 1, 1), (1, -1, -1), (-1, 1, -1), (-1, -1, 1)]
for ri, (a, b, c) in zip(R, signs_ok):
    assert is_zero(ri - (e1 + a*s1 + b*s2 + c*s3)/4)
print("r_i = (e1 +/- s1 +/- s2 +/- s3)/4  with sign patterns")
print("  (+,+,+) (+,-,-) (-,+,-) (-,-,+)   -- product of signs = +1"
      "  [verified]")

# Why only those four?  Because s1*s2*s3 is itself symmetric -- computable
# from the coefficients -- so once two square-root signs are chosen, the
# third is forced:
assert is_zero(s1*s2*s3 - (e1**3 - 4*e1*e2 + 8*e3))
print("s1*s2*s3 = e1^3 - 4 e1 e2 + 8 e3   [verified]")
print("=> only 2 of the 3 sqrt signs are free: 4 outcomes, one per root.")
print("   Flipping an allowed pair of signs = acting by an element of the")
print("   Klein group V: it permutes WHICH root you get, never leaves the")
print("   root set.")

# ----------------------------------------------------------------------
hr("3. The ambiguity, explicitly: S4 relabelings act on the radical layers")

perm_names = {
    (2, 1, 3, 4): "(12)",
    (1, 3, 2, 4): "(23)",
    (1, 2, 4, 3): "(34)",
    (2, 1, 4, 3): "(12)(34)",
    (2, 3, 1, 4): "(123)",
    (2, 3, 4, 1): "(1234)",
}

def act(expr, perm):
    """Relabel the roots: r_i -> r_perm[i]."""
    return expr.subs({R[i]: R[p - 1] for i, p in enumerate(perm)},
                     simultaneous=True)

def identify(expr):
    """Express a transformed pair-sum as +/- s_k."""
    for k, sk in enumerate(S, start=1):
        if is_zero(expr - sk):
            return f"+s{k}"
        if is_zero(expr + sk):
            return f"-s{k}"
    raise AssertionError(f"not a signed pair-sum: {expr}")

print("relabeling      (s1, s2, s3) ->        (y1,y2,y3) ->")
for perm, name in perm_names.items():
    s_img = tuple(identify(act(sk, perm)) for sk in S)
    y_img = []
    for yk in (y1, y2, y3):
        t = act(yk, perm)
        j = next(i for i, ym in enumerate((y1, y2, y3), 1) if is_zero(t - ym))
        y_img.append(f"y{j}")
    print(f"  {name:<10}  {str(s_img):<24} {tuple(y_img)}")

for perm in perm_names:
    for ek in (e1, e2, e3, e4):
        assert is_zero(act(ek, perm) - ek)
print("\nEvery relabeling permutes {y_k} (the cube-root layer) and permutes/")
print("sign-flips {s_k} preserving s1*s2*s3 (the square-root layer), while")
print("fixing e1..e4 -- the formula's only input.  So the branch choices")
print("shuffle, the emitted 4-element set does not.")

# ----------------------------------------------------------------------
hr("4. sqrt(discriminant): the parity layer (S4 vs A4)")

vandermonde = sp.prod(R[i] - R[j] for i, j in
                      itertools.combinations(range(4), 2))
disc = sp.discriminant(quartic, x)
assert is_zero(disc - sp.expand(vandermonde**2))
print("disc = [ prod_{i<j} (r_i - r_j) ]^2   [verified]")

swapped = act(vandermonde, (2, 1, 3, 4))
assert is_zero(swapped + vandermonde)
print("swapping any two roots flips the sign of prod (r_i - r_j),")
print("but disc -- the formula's input -- is blind to it.  Choosing a sign")
print("for sqrt(disc) (inside the cubic formula) = choosing a coset of A4:")
print("the formula cannot tell even relabelings from odd ones.")

# ----------------------------------------------------------------------
hr("5. Numeric demo: two labelings, identical formula output")

values = (1, 2, 3, 5)
for label in [values, values[::-1]]:
    sub = dict(zip(R, label))
    p_num = sp.Poly(quartic.subs(sub), x)
    branches = [sp.nsimplify(b.evalf(chop=True), rational=True)
                for b in roots_quartic(p_num)]
    who = [f"branch{i}={v}  (this is r{label.index(v) + 1}"
           " in this labeling)" for i, v in enumerate(branches, 1)]
    print(f"labeling (r1,r2,r3,r4) = {label}:")
    print(f"  coefficients: {p_num.all_coeffs()}")
    for w in who:
        print("   ", w)
print("Same coefficients, same four branch values, in the same branch")
print("order -- only the *names* r_i attached to each value moved.")
print("The formula answered the only question it can answer:")
print("'what is the root SET'.")

# ----------------------------------------------------------------------
hr("6. Committing to an ordering resolves the radicals")

d1, d2, d3 = sp.symbols("d1 d2 d3", positive=True)
t = sp.symbols("t", real=True)
ordering = {r4: t, r3: t + d3, r2: t + d3 + d2, r1: t + d3 + d2 + d1}

sqrt_disc = sp.sqrt(sp.factor(disc.subs(ordering, simultaneous=True)))
resolved = sp.expand(sqrt_disc - vandermonde.subs(ordering,
                                                  simultaneous=True))
assert resolved == 0
print("declare r1 > r2 > r3 > r4  (r4 = t, gaps d1,d2,d3 > 0):")
print("  sqrt(disc) now simplifies to exactly prod_{i<j}(r_i - r_j) > 0")
print("  [verified] -- the sign ambiguity is gone.")

for sk in S:
    sk_ord = sk.subs(ordering, simultaneous=True)
    sq = sp.sqrt(sp.factor(sp.expand(sk_ord**2)))
    print(f"  sqrt(({sk})^2) -> {sp.expand(sq)}"
          f"   [equals s_k: {is_zero(sq - sk_ord)}]")
print("Note the subtlety: the ordering pins down the signs of s1 and s2,")
print("but sqrt(s3^2) = Abs(d1 - d3): the sign of s3 = r1-r2-r3+r4 depends")
print("on which outer gap is bigger, which even a full ordering does not")
print("decide.  That last sign is supplied by the product constraint of")
print("section 2 -- given sqrt(s1^2)=s1 and sqrt(s2^2)=s2, the formula must")
print("take the third square root as (e1^3 - 4 e1 e2 + 8 e3)/(s1 s2), which")
print("IS the correctly signed s3.  So: the ordering resolves the parity and")
print("pairing layers, and the coefficient-valued product s1 s2 s3 resolves")
print("the final sign.  The ambiguity was never in the algebra -- it is")
print("exactly the information the symmetric coefficients do not carry.")
