use crate::structures::GenString;
use rand::{prelude::Distribution, Rng};

impl Distribution<u8> for GenString {
    fn sample<R: Rng + ?Sized>(&self, rng: &mut R) -> u8 {
        const RANGE: u32 = 26 + 26 + 10;
        const GEN_ASCII_STR_CHARSET: &[u8] =
            r"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".as_bytes();
        loop {
            let var = rng.next_u32() >> (32 - 6);
            if var < RANGE {
                return GEN_ASCII_STR_CHARSET[var as usize];
            }
        }
    }
}
